#!/usr/bin/env bash
# Autodeploy der Vorschau (ictbaden.netgetvpn.de) auf docker01 – ohne Registry, ohne Zugangsdaten.
#
# Läuft alle 5 Minuten (systemd-Timer ictbaden-autodeploy.timer). Holt main aus dem öffentlichen Repo, prüft über die
# öffentliche GitHub-API, dass die CI für genau diesen Commit grün ist, baut die Seite in einem Node-Container
# (wie die CI: SITE_STAGING=1, volle Git-Historie für lastmod) und schaltet atomar auf das neue Release um –
# zusammen mit der nginx-Konfiguration (Zeilen mit „# LIVE“ entfallen, wie im Dockerfile). Antwortet die Seite danach
# nicht mit dem neuen Commit, wird auf das vorherige Release und die vorherige Konfiguration zurückgerollt.
#
#   deploy/autodeploy/install.sh        auf docker01 einrichten (einmalig, als root)
#   systemctl start ictbaden-autodeploy  sofort prüfen und ggf. deployen
#   journalctl -u ictbaden-autodeploy    Protokoll
#
# Anhalten (etwa für einen Hand-Deploy eines älteren Stands): touch $BASE/autodeploy.pause – löschen setzt fort.
set -euo pipefail

BASE="${BASE:-/srv/docker/ictbaden.netgetvpn.de}"
REPO_URL="${REPO_URL:-https://github.com/ict-baden/website.git}"
API="https://api.github.com/repos/ict-baden/website"
SITE_HOST="ictbaden.netgetvpn.de"
LOCAL_URL="http://192.168.4.6:8017"
CONTAINER="ictbaden-web"
KEEP=5

SRC="$BASE/autodeploy/src"
CACHE="$BASE/autodeploy/npm-cache"
WEB="$BASE/public_html"
CONF="$BASE/conf/default.conf"

log() { echo "[$(date -u +%FT%TZ)] $*"; }

exec 9>"$BASE/autodeploy/lock"
flock -n 9 || { log "läuft schon"; exit 0; }
[ -e "$BASE/autodeploy.pause" ] && { log "pausiert ($BASE/autodeploy.pause)"; exit 0; }

mkdir -p "$CACHE"
if [ ! -d "$SRC/.git" ]; then git clone -q "$REPO_URL" "$SRC"; fi
git -C "$SRC" fetch -q origin main
SHA="$(git -C "$SRC" rev-parse origin/main)"
SHORT="${SHA:0:7}"
CURRENT="$(cat "$WEB/current/version.txt" 2>/dev/null || true)"
[ "$CURRENT" = "$SHORT" ] && exit 0

# CI muss für genau diesen Commit fertig und grün sein (alle Check-Runs „success“ oder „skipped“)
RUNS="$(curl -fsS -H 'Accept: application/vnd.github+json' "$API/commits/$SHA/check-runs?per_page=100")"
TOTAL="$(jq '.total_count' <<<"$RUNS")"
PENDING="$(jq '[.check_runs[] | select(.status != "completed")] | length' <<<"$RUNS")"
BAD="$(jq '[.check_runs[] | select(.status == "completed" and (.conclusion != "success" and .conclusion != "skipped" and .conclusion != "neutral"))] | length' <<<"$RUNS")"
if [ "$TOTAL" = 0 ] || [ "$PENDING" != 0 ]; then log "$SHORT: CI noch nicht fertig"; exit 0; fi
if [ "$BAD" != 0 ]; then log "$SHORT: CI nicht grün – nicht deployt"; exit 0; fi

log "$SHORT: CI grün, baue (live war: ${CURRENT:-keins})"
git -C "$SRC" checkout -q --force "$SHA"
git -C "$SRC" clean -qfdx -e node_modules
NODE="node:$(tr -d ' \n' < "$SRC/.nvmrc")"
docker run --rm -v "$SRC:/w" -v "$CACHE:/root/.npm" -w /w \
  -e ASTRO_TELEMETRY_DISABLED=1 -e SITE_STAGING=1 -e SITE_URL="https://$SITE_HOST" \
  "$NODE" sh -c 'git config --global --add safe.directory /w && npm ci --no-audit --no-fund >/dev/null && npm run build >/dev/null && npm run check:links >/dev/null'
echo "$SHORT" > "$SRC/dist/version.txt"

REL="releases/$(date -u +%Y%m%d-%H%M%S)-$SHORT"
PREV="$(readlink "$WEB/current" || true)"
mkdir -p "$WEB/$REL"
cp -a "$SRC/dist/." "$WEB/$REL/"
chown -R www-data:www-data "$WEB/$REL"

cp "$CONF" "$CONF.prev"
switch_to() {  # $1 Release (relativ zu $WEB)
  ln -sfn "$1" "$WEB/current.tmp"; chown -h www-data:www-data "$WEB/current.tmp"; mv -Tf "$WEB/current.tmp" "$WEB/current"
}
rollback() {
  log "$SHORT: Rückfall auf ${PREV:-?}"
  [ -n "$PREV" ] && switch_to "$PREV"
  cat "$CONF.prev" > "$CONF"
  docker exec "$CONTAINER" nginx -s reload >/dev/null 2>&1 || true
  rm -rf "${WEB:?}/$REL"
  exit 1
}

# Konfiguration in die bestehende Datei schreiben (Einzeldatei-Mount: gleiche Inode behalten)
grep -v '# LIVE[[:space:]]*$' "$SRC/deploy/nginx.conf" > "$CONF"
docker exec "$CONTAINER" nginx -t -q || rollback
switch_to "$REL"
docker exec "$CONTAINER" nginx -s reload >/dev/null

for _ in $(seq 1 20); do
  got="$(curl -fsS -H "Host: $SITE_HOST" "$LOCAL_URL/version.txt" 2>/dev/null || true)"
  [ "$got" = "$SHORT" ] && break
  sleep 1
done
[ "$got" = "$SHORT" ] || rollback
[ "$(curl -s -o /dev/null -w '%{http_code}' -H "Host: $SITE_HOST" "$LOCAL_URL/")" = 200 ] || rollback

# Alte Releases aufräumen (die letzten $KEEP bleiben)
ls -1 "$WEB/releases" | sort | head -n -"$KEEP" | while read -r r; do rm -rf "${WEB:?}/releases/$r"; done
log "$SHORT: live"
