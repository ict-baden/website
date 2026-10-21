#!/usr/bin/env bash
# Website auf docker01 von Hand aktualisieren, zurückrollen oder (beim Livegang) die Live-Fassung starten.
#
# Normalerweise nicht nötig: jeder Push auf main baut in der CI ghcr.io/ict-baden/website:latest (Vorschau, noindex)
# und :live (ict-baden.de, indexierbar); Watchtower auf docker01 holt neue Versionen innerhalb von 5 Minuten.
#
#   deploy/deploy.sh                              Vorschau sofort auf :latest ziehen
#   IMAGE_TAG=9597d8b deploy/deploy.sh            Vorschau auf einen älteren Commit (Watchtower bleibt dort stehen)
#   IMAGE_TAG=latest deploy/deploy.sh             Vorschau folgt wieder dem Autodeploy
#   SITE_MODE=live deploy/deploy.sh               Live-Fassung (ict-baden.de) starten bzw. auf :live ziehen, prüfen und
#                                                 die Adressen der Sitemap an IndexNow melden (wenn INDEXNOW_KEY gesetzt)
#   SKIP_OUTSIDE=1 SITE_MODE=live deploy/deploy.sh   nur starten, ohne Prüfung von außen und ohne IndexNow – beim
#                                                 ersten Start, solange ict-baden.de noch auf die alte Seite zeigt
#   SITE_MODE=live IMAGE_TAG=live-9597d8b deploy/deploy.sh   Live-Fassung auf einen älteren Commit
#
# Umgebung (alle optional):
#   SITE_MODE     preview (Standard) oder live
#   DEPLOY_HOST   ssh-Ziel                   (Standard: root@docker01.eu.tillniederauer.de)
#   DEPLOY_DIR    Verzeichnis auf dem Server  (Standard: /srv/docker/ictbaden.netgetvpn.de bzw. /srv/docker/ict-baden.de)
#   SITE_URL      Adresse für die Prüfung     (Standard: https://ictbaden.netgetvpn.de bzw. https://ict-baden.de)
#   INDEXNOW_KEY  nur live: derselbe Schlüssel wie im Build (Repo-Variable INDEXNOW_KEY), sonst kein IndexNow
#   SKIP_OUTSIDE  nur live: 1 = keine Prüfung über SITE_URL und kein IndexNow (vor dem DNS-Umzug)
set -euo pipefail

MODE="${SITE_MODE:-preview}"
HOST="${DEPLOY_HOST:-root@docker01.eu.tillniederauer.de}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ "$MODE" = live ]; then
  DIR="${DEPLOY_DIR:-/srv/docker/ict-baden.de}"
  TAG="${IMAGE_TAG:-live}"
  DEFAULT_TAG=live
  SITE_URL="${SITE_URL:-https://ict-baden.de}"
  COMPOSE="$ROOT/deploy/docker-compose.live.yml"
  PORT=8018
elif [ "$MODE" = preview ]; then
  DIR="${DEPLOY_DIR:-/srv/docker/ictbaden.netgetvpn.de}"
  TAG="${IMAGE_TAG:-latest}"
  DEFAULT_TAG=latest
  SITE_URL="${SITE_URL:-https://ictbaden.netgetvpn.de}"
  COMPOSE="$ROOT/deploy/docker-compose.yml"
  PORT=8017
else
  echo "SITE_MODE muss preview oder live sein" >&2; exit 2
fi
# Nie das Vorschau-Image (noindex, canonical auf netgetvpn) auf ict-baden.de und nie das Live-Image auf die Vorschau
case "$MODE:$TAG" in
  live:live|live:live-*) ;;
  live:*) echo "SITE_MODE=live braucht IMAGE_TAG=live oder live-<commit> (nicht $TAG)" >&2; exit 2 ;;
  preview:live*) echo "Die Vorschau darf nicht das Live-Image $TAG bekommen" >&2; exit 2 ;;
esac
EXPECT_STAGING=$([ "$MODE" = live ] && echo 0 || echo 1)
# Host-Kopf für die Prüfung auf docker01: Das Live-Image leitet jede andere Adresse auf https://ict-baden.de um
# (deploy/nginx.conf), /version.txt käme über 192.168.4.6 sonst als Weiterleitung zurück
SITE_HOST="${SITE_URL#https://}"

echo "==> $MODE: docker-compose.yml nach $HOST:$DIR"
ssh "$HOST" mkdir -p "$DIR"
scp -q "$COMPOSE" "$HOST:$DIR/docker-compose.yml"

echo "==> Image $TAG ziehen und starten"
ssh "$HOST" bash -s -- "$DIR" "$TAG" "$DEFAULT_TAG" "$PORT" "$EXPECT_STAGING" "$SITE_HOST" <<'REMOTE'
set -euo pipefail
cd "$1"
# Erst ziehen und prüfen, dann umschalten: das Label de.ict-baden.staging (deploy/Dockerfile) muss zum Modus passen
docker pull -q "ghcr.io/ict-baden/website:$2" >/dev/null
got="$(docker image inspect --format '{{ index .Config.Labels "de.ict-baden.staging" }}' "ghcr.io/ict-baden/website:$2")"
# Ältere Images (vor dem Label) sind alle Vorschau-Images
if [ "$got" != "$5" ] && ! { [ "$5" = 1 ] && [ -z "$got" ]; }; then echo "Image $2 hat staging=$got, erwartet $5 – nichts umgeschaltet" >&2; exit 1; fi
# Der Tag bleibt in .env stehen, damit auch ein späteres "docker compose up" denselben Stand nimmt
if [ "$2" = "$3" ]; then rm -f .env; else echo "IMAGE_TAG=$2" > .env; fi
docker compose pull -q
docker compose up -d --remove-orphans
for _ in $(seq 1 30); do
  curl -fsS -o /dev/null "http://192.168.4.6:$4/health" 2>/dev/null && { echo "läuft: $(curl -fsS -H "Host: $6" "http://192.168.4.6:$4/version.txt")"; exit 0; }
  sleep 1
done
echo "Gesundheitsprüfung fehlgeschlagen" >&2
exit 1
REMOTE

if [ "$MODE" = live ] && [ -n "${SKIP_OUTSIDE:-}" ]; then
  echo "==> Prüfung von außen übersprungen (SKIP_OUTSIDE): $SITE_URL zeigt noch nicht auf diesen Container"
elif [ "$MODE" = live ]; then
  echo "==> Prüfung von außen: $SITE_URL"
  sleep 5
  # Antworten erst ganz lesen, dann suchen: „curl … | grep -q“ bricht unter pipefail ab, wenn grep früh fündig wird
  # und curl beim Weiterschreiben SIGPIPE bekommt (Exit 23) – bei der Startseite (über 100 KB) fast jedes zweite Mal
  if grep -qi '^x-robots-tag' <<<"$(curl -sI "$SITE_URL/")"; then echo "FEHLER: $SITE_URL sendet X-Robots-Tag" >&2; exit 1; fi
  if grep -q '^Disallow: */ *$' <<<"$(curl -fsS "$SITE_URL/robots.txt")"; then echo "FEHLER: robots.txt sperrt" >&2; exit 1; fi
  grep -q "<link rel=\"canonical\" href=\"$SITE_URL/\"" <<<"$(curl -fsS "$SITE_URL/")" || { echo "FEHLER: canonical nicht $SITE_URL" >&2; exit 1; }
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$SITE_URL/")" = 200 ] || { echo "FEHLER: $SITE_URL/ antwortet nicht mit 200 (Host-Kopf im Tunnel umgeschrieben?)" >&2; exit 1; }
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$SITE_URL/produkte/enterprisebrowser/")" = 301 ] || { echo "FEHLER: Weiterleitungen fehlen" >&2; exit 1; }
  # IndexNow einmal beim Livegang (oder nach großen Änderungen): nur mit INDEXNOW_KEY in der Umgebung
  if [ -n "${INDEXNOW_KEY:-}" ]; then
    echo "==> IndexNow: Adressen der Sitemap melden"
    curl -fsS "$SITE_URL/$INDEXNOW_KEY.txt" >/dev/null || { echo "FEHLER: $SITE_URL/$INDEXNOW_KEY.txt fehlt (Repo-Variable INDEXNOW_KEY gesetzt?)" >&2; exit 1; }
    URLS="$(curl -fsS "$SITE_URL/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -e 's#<loc>##' -e 's#</loc>##' | sed 's/.*/"&"/' | paste -sd, -)"
    HOSTNAME="${SITE_URL#https://}"
    curl -fsS -X POST https://api.indexnow.org/indexnow -H 'Content-Type: application/json; charset=utf-8' \
      -d "{\"host\":\"$HOSTNAME\",\"key\":\"$INDEXNOW_KEY\",\"keyLocation\":\"$SITE_URL/$INDEXNOW_KEY.txt\",\"urlList\":[$URLS]}" \
      -o /dev/null -w 'IndexNow: HTTP %{http_code}\n'
  fi
fi

echo "==> Fertig: $SITE_URL (Commit unter $SITE_URL/version.txt)"
