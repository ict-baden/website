#!/usr/bin/env bash
# Baut die Website und spielt sie auf docker01 ein.
#
#   deploy/deploy.sh
#
# Ablauf: Build und Prüfungen lokal → Dateien per tar | ssh in ein NEUES Release-Verzeichnis →
# nginx-Konfiguration in einem Wegwerf-Container testen → Symlink public_html/current atomar
# umschalten → nginx neu laden → Gesundheitsprüfung und Prüfung von Kopfzeilen und Weiterleitungen
# (sonst zurück auf das vorige Release und die vorige Konfiguration) → alte Releases aufräumen (das aktive nie)
# → beim Livegang geänderte Adressen an IndexNow melden (wenn INDEXNOW_KEY gesetzt ist).
# Das laufende Release wird zu keinem Zeitpunkt gelöscht oder überschrieben.
#
# Umgebung (alle optional):
#   DEPLOY_HOST   ssh-Ziel                      (Standard: root@docker01.eu.tillniederauer.de)
#   DEPLOY_DIR    Verzeichnis auf dem Server     (Standard: /opt/ictbaden)
#   SITE_URL      kanonische Adresse             (Standard: https://ictbaden.netgetvpn.de)
#   SITE_STAGING  1 = Vorschau mit noindex       (Standard: 1); 0 = Livegang
#   KEEP          Anzahl Releases, die bleiben   (Standard: 5)
#   INDEXNOW_KEY  IndexNow-Schlüssel             (optional; nur beim Livegang: Sitemap-Adressen an IndexNow melden)
#   GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION  Bestätigungs-Meta-Tags (optional, siehe README)
set -euo pipefail

HOST="${DEPLOY_HOST:-root@docker01.eu.tillniederauer.de}"
DIR="${DEPLOY_DIR:-/opt/ictbaden}"
KEEP="${KEEP:-5}"
export SITE_URL="${SITE_URL:-https://ictbaden.netgetvpn.de}"
export SITE_STAGING="${SITE_STAGING:-1}"
export ASTRO_TELEMETRY_DISABLED=1

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
REV="$(git rev-parse --short HEAD 2>/dev/null || echo lokal)"
RELEASE="$(date -u +%Y%m%d-%H%M%S)-$REV"

echo "==> Build ($SITE_URL, Staging=$SITE_STAGING, Release $RELEASE)"
npm ci --no-audit --no-fund
npm run build
npm run check:products
npm run check:links
npm run check:seo
test -f dist/index.html && test -f dist/404.html

# nginx-Konfiguration für den Modus: beim Livegang entfallen die mit "# STAGING" markierten Zeilen
CONF="$(mktemp)"
trap 'rm -f "$CONF"' EXIT
if [ "$SITE_STAGING" = "0" ]; then
  grep -v '# STAGING' deploy/nginx.conf > "$CONF"
else
  cp deploy/nginx.conf "$CONF"
fi

echo "==> Upload nach $HOST:$DIR/public_html/releases/$RELEASE"
ssh "$HOST" "mkdir -p '$DIR/public_html/releases/$RELEASE' '$DIR/conf'"
tar -C dist -czf - . | ssh "$HOST" "tar -xzf - -C '$DIR/public_html/releases/$RELEASE'"
scp -q "$CONF" "$HOST:$DIR/conf/default.conf.new"
scp -q deploy/docker-compose.yml "$HOST:$DIR/docker-compose.yml.new"

echo "==> Umschalten"
ssh "$HOST" bash -s -- "$DIR" "$RELEASE" "$KEEP" "$SITE_STAGING" <<'REMOTE'
set -euo pipefail
DIR="$1"; RELEASE="$2"; KEEP="$3"; STAGING="$4"
NEW="$DIR/public_html/releases/$RELEASE"
CUR_LINK="$DIR/public_html/current"

# Vollständigkeit des neuen Release prüfen
test -f "$NEW/index.html" && test -f "$NEW/404.html" && test -d "$NEW/_astro"

# current muss ein Symlink sein (oder noch fehlen) – ein echtes Verzeichnis wird nicht angefasst
if [ -e "$CUR_LINK" ] && [ ! -L "$CUR_LINK" ]; then
  echo "Abbruch: $CUR_LINK ist kein Symlink. Bitte einmalig von Hand umstellen." >&2
  exit 1
fi

# neue Konfiguration mit dem neuen Release in einem Wegwerf-Container testen
docker run --rm \
  -v "$DIR/conf/default.conf.new:/etc/nginx/conf.d/default.conf:ro" \
  -v "$NEW:/usr/share/nginx/html/current:ro" \
  nginx:1.27-alpine nginx -t -q

# vorige Konfiguration aufheben (für das Zurückschalten)
if [ -f "$DIR/conf/default.conf" ]; then cp -p "$DIR/conf/default.conf" "$DIR/conf/default.conf.prev"; fi
mv -f "$DIR/conf/default.conf.new" "$DIR/conf/default.conf"
mv -f "$DIR/docker-compose.yml.new" "$DIR/docker-compose.yml"

# atomarer Wechsel: neuen Symlink anlegen und per rename über den alten legen
PREV="$(readlink "$CUR_LINK" 2>/dev/null || true)"
ln -sfn "releases/$RELEASE" "$DIR/public_html/current.new"
mv -Tf "$DIR/public_html/current.new" "$CUR_LINK"

cd "$DIR"
docker compose up -d --remove-orphans
docker compose exec -T web nginx -s reload

BASE="http://192.168.4.6:8017"
# Statuscode ohne Weiterleitungen zu folgen bzw. Kopfzeilen einer Adresse (curl auf dem Host, sonst wget im Container)
status() {
  if command -v curl >/dev/null 2>&1; then curl -s -o /dev/null -w '%{http_code}' "$BASE$1"
  else docker compose exec -T web wget -S --spider -q "http://127.0.0.1$1" 2>&1 | awk '/HTTP\//{print $2; exit}'; fi
}
headers() {
  if command -v curl >/dev/null 2>&1; then curl -sI "$BASE$1"
  else docker compose exec -T web wget -S --spider -q "http://127.0.0.1$1" 2>&1; fi
}

rollback() {
  echo "$1 – schalte zurück auf ${PREV:-(kein vorheriges Release)}" >&2
  if [ -f "$DIR/conf/default.conf.prev" ]; then cp -p "$DIR/conf/default.conf.prev" "$DIR/conf/default.conf"; fi
  if [ -n "$PREV" ]; then
    ln -sfn "$PREV" "$DIR/public_html/current.new" && mv -Tf "$DIR/public_html/current.new" "$CUR_LINK"
  fi
  docker compose exec -T web nginx -s reload || true
  exit 1
}

ok=0
for _ in $(seq 1 20); do
  if [ "$(status /health)" = "200" ]; then
    ok=1; break
  fi
  sleep 1
done
[ "$ok" = 1 ] || rollback "Gesundheitsprüfung fehlgeschlagen"

# Wirkt die neue Konfiguration wirklich? (Früher blieb nginx bei einer einzeln eingebundenen Datei auf dem alten Stand.)
fails=""
[ "$(status /produkte/industrialkeyboard)" = "301" ] || fails="$fails /produkte/industrialkeyboard≠301"
[ "$(status /produkte/haertungs-check/)" = "301" ] || fails="$fails /produkte/haertungs-check/≠301"
[ "$(status '/index.html?page=contact')" = "301" ] || fails="$fails /index.html?page=contact≠301"
[ "$(status /produkte/vitrine/)" = "200" ] || fails="$fails /produkte/vitrine/≠200"
h="$(headers /)"
if [ "$STAGING" = "0" ]; then
  if grep -qi '^ *x-robots-tag' <<<"$h"; then fails="$fails X-Robots-Tag-beim-Livegang"; fi
else
  if ! grep -qi '^ *x-robots-tag: *noindex' <<<"$h"; then fails="$fails X-Robots-Tag-fehlt-in-der-Vorschau"; fi
fi
[ -z "$fails" ] || rollback "Prüfung nach dem Umschalten fehlgeschlagen:$fails"

# alte Releases aufräumen: die neuesten $KEEP bleiben, das aktive immer
ACTIVE="$(readlink "$CUR_LINK")"
ls -1dt "$DIR"/public_html/releases/*/ 2>/dev/null | tail -n +"$((KEEP + 1))" | while read -r d; do
  d="${d%/}"
  [ "releases/$(basename "$d")" = "$ACTIVE" ] || rm -rf -- "$d"
done
echo "Aktiv: $ACTIVE"
REMOTE

# Livegang: geänderte Adressen an IndexNow melden (Bing, Yandex u. a.; ChatGPT-Suche und Copilot nutzen den Bing-Index).
# Schlägt das fehl, ist der Deploy trotzdem fertig – dann in den Bing Webmaster Tools die Sitemap einreichen.
if [ "$SITE_STAGING" = "0" ] && [ -n "${INDEXNOW_KEY:-}" ]; then
  echo "==> IndexNow"
  code="$(node -e '
    const fs = require("node:fs");
    const site = process.env.SITE_URL;
    const urls = [...fs.readFileSync("dist/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    process.stdout.write(JSON.stringify({ host: new URL(site).host, key: process.env.INDEXNOW_KEY, keyLocation: `${site}/${process.env.INDEXNOW_KEY}.txt`, urlList: urls }));
  ' | curl -s -o /dev/null -w '%{http_code}' -H 'Content-Type: application/json; charset=utf-8' --data-binary @- https://api.indexnow.org/indexnow || true)"
  case "$code" in
    200|202) echo "IndexNow: angenommen ($code)" ;;
    *) echo "IndexNow: Antwort $code – Sitemap bei Bing Webmaster Tools einreichen" >&2 ;;
  esac
fi

echo "==> Fertig: $SITE_URL"
