#!/usr/bin/env bash
# Baut die Website und spielt sie auf docker01 ein.
#
#   deploy/deploy.sh
#
# Ablauf: Build und Prüfungen lokal → Dateien per tar | ssh in ein NEUES Release-Verzeichnis →
# nginx-Konfiguration in einem Wegwerf-Container testen → Symlink public_html/current atomar
# umschalten → nginx neu laden → Gesundheitsprüfung → alte Releases aufräumen (das aktive nie).
# Das laufende Release wird zu keinem Zeitpunkt gelöscht oder überschrieben.
#
# Umgebung (alle optional):
#   DEPLOY_HOST   ssh-Ziel                      (Standard: root@docker01.eu.tillniederauer.de)
#   DEPLOY_DIR    Verzeichnis auf dem Server     (Standard: /opt/ictbaden)
#   SITE_URL      kanonische Adresse             (Standard: https://ictbaden.netgetvpn.de)
#   SITE_STAGING  1 = Vorschau mit noindex       (Standard: 1); 0 = Livegang
#   KEEP          Anzahl Releases, die bleiben   (Standard: 5)
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
ssh "$HOST" bash -s -- "$DIR" "$RELEASE" "$KEEP" <<'REMOTE'
set -euo pipefail
DIR="$1"; RELEASE="$2"; KEEP="$3"
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

mv -f "$DIR/conf/default.conf.new" "$DIR/conf/default.conf"
mv -f "$DIR/docker-compose.yml.new" "$DIR/docker-compose.yml"

# atomarer Wechsel: neuen Symlink anlegen und per rename über den alten legen
PREV="$(readlink "$CUR_LINK" 2>/dev/null || true)"
ln -sfn "releases/$RELEASE" "$DIR/public_html/current.new"
mv -Tf "$DIR/public_html/current.new" "$CUR_LINK"

cd "$DIR"
docker compose up -d --remove-orphans
docker compose exec -T web nginx -s reload

ok=0
for _ in $(seq 1 20); do
  if curl -fsS -o /dev/null http://192.168.4.6:8017/health 2>/dev/null || wget -q -O /dev/null http://192.168.4.6:8017/health 2>/dev/null; then
    ok=1; break
  fi
  sleep 1
done
if [ "$ok" != 1 ]; then
  echo "Gesundheitsprüfung fehlgeschlagen – schalte zurück auf ${PREV:-(kein vorheriges Release)}" >&2
  if [ -n "$PREV" ]; then
    ln -sfn "$PREV" "$DIR/public_html/current.new" && mv -Tf "$DIR/public_html/current.new" "$CUR_LINK"
    docker compose exec -T web nginx -s reload || true
  fi
  exit 1
fi

# alte Releases aufräumen: die neuesten $KEEP bleiben, das aktive immer
ACTIVE="$(readlink "$CUR_LINK")"
ls -1dt "$DIR"/public_html/releases/*/ 2>/dev/null | tail -n +"$((KEEP + 1))" | while read -r d; do
  d="${d%/}"
  [ "releases/$(basename "$d")" = "$ACTIVE" ] || rm -rf -- "$d"
done
echo "Aktiv: $ACTIVE"
REMOTE

echo "==> Fertig: $SITE_URL"
