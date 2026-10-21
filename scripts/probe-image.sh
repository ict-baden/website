#!/usr/bin/env bash
# Startet ein gebautes Website-Image einmal und prüft, dass nginx-Konfiguration und Seite zusammenpassen.
#   scripts/probe-image.sh <image> staging|live <commit>
# staging: X-Robots-Tag noindex auf jeder Antwort, robots.txt sperrt alles.
# live:    kein X-Robots-Tag, kein <meta name="robots" content="noindex">, robots.txt ohne "Disallow: /",
#          kanonische Adresse, hreflang und Sitemap auf https://ict-baden.de.
set -euo pipefail
IMAGE="$1"; MODE="$2"; REV="$3"
NAME="probe-$MODE-$$"
docker run --rm -d --name "$NAME" -p 127.0.0.1::80 "$IMAGE" >/dev/null
trap 'docker rm -f "$NAME" >/dev/null 2>&1 || true' EXIT
PORT="$(docker port "$NAME" 80/tcp | head -1 | sed 's/.*://')"
B="http://127.0.0.1:$PORT"
for _ in $(seq 1 30); do curl -fsS "$B/health" >/dev/null 2>&1 && break; sleep 1; done

fail() { echo "FEHLER ($MODE): $*" >&2; exit 1; }
code() { curl -s -o /dev/null -w '%{http_code}' "$B$1"; }
loc() { curl -s -o /dev/null -w '%{redirect_url}' "$B$1" | sed "s#^$B##"; }
expect() { local c; c="$(code "$1")"; [ "$c" = "$2" ] || fail "$1 → $c statt $2"; }
redirect() { expect "$1" 301; local l; l="$(loc "$1")"; [ "$l" = "$2" ] || fail "$1 → $l statt $2"; }

[ "$(curl -fsS "$B/version.txt")" = "$REV" ] || fail "version.txt"
expect / 200
for p in vitrine riegel zutritt lupe pforte industrial-keyboard plakette; do
  expect "/produkte/$p/" 200
  expect "/en/products/$p/" 200
done
for a in vitrine lupe zutritt riegel plakette pforte industrialkeyboard; do expect "/datenschutz/$a/" 200; done
expect /impressum/ 200
expect /datenschutz/ 200
redirect /impressum /impressum/
redirect /produkte/industrialkeyboard /produkte/industrial-keyboard/
redirect /produkte/haertungs-check/ /produkte/riegel/
redirect /produkte/labeldesigner/ /produkte/plakette/
redirect /produkte/enterprisebrowser/ /produkte/pforte/
redirect /en/products/enterprisebrowser/ /en/products/pforte/
redirect /datenschutz/enterprisebrowser/ /datenschutz/pforte/
redirect '/index.html?page=contact' '/#kontakt'
expect /produkte/hausmeister/ 410
expect /produkte/s7-explorer 410
expect /en/products/lotse/ 410
expect /gibt-es-nicht/ 404
# www → Hauptadresse
[ "$(curl -s -o /dev/null -w '%{redirect_url}' -H 'Host: www.ict-baden.de' "$B/produkte/vitrine/")" = "https://ict-baden.de/produkte/vitrine/" ] || fail "www → apex"

HEAD="$(curl -sI "$B/")"
ROBOTS="$(curl -fsS "$B/robots.txt")"
HOMEPAGE="$(curl -fsS "$B/")"
PRODUCT="$(curl -fsS "$B/produkte/vitrine/")"
if [ "$MODE" = staging ]; then
  grep -qi '^x-robots-tag: *noindex' <<<"$HEAD" || fail "X-Robots-Tag noindex fehlt"
  grep -qi '^x-robots-tag: *noindex' <<<"$(curl -sI "$B/produkte/vitrine/")" || fail "X-Robots-Tag noindex fehlt auf Produktseite"
  grep -q '^Disallow: /$' <<<"$ROBOTS" || fail "robots.txt sperrt nicht"
  grep -q 'name="robots" content="noindex' <<<"$HOMEPAGE" || fail "meta noindex fehlt"
else
  grep -qi '^x-robots-tag' <<<"$HEAD" && fail "X-Robots-Tag in der Livegang-Fassung"
  grep -qi '^x-robots-tag' <<<"$(curl -sI "$B/produkte/vitrine/")" && fail "X-Robots-Tag auf Produktseite"
  grep -q '^Disallow: */ *$' <<<"$ROBOTS" && fail "robots.txt enthält Disallow: /"
  grep -q '^Sitemap: https://ict-baden.de/sitemap.xml$' <<<"$ROBOTS" || fail "robots.txt ohne Sitemap auf ict-baden.de"
  grep -qi 'name="robots"[^>]*noindex' <<<"$HOMEPAGE$PRODUCT" && fail "meta noindex in der Livegang-Fassung"
  grep -q '<link rel="canonical" href="https://ict-baden.de/produkte/vitrine/"' <<<"$PRODUCT" || fail "canonical nicht auf ict-baden.de"
  grep -q 'hreflang="en" href="https://ict-baden.de/en/products/vitrine/"' <<<"$PRODUCT" || fail "hreflang nicht auf ict-baden.de"
  grep -q 'netgetvpn' <<<"$HOMEPAGE$PRODUCT$ROBOTS$(curl -fsS "$B/sitemap.xml")" && fail "Vorschau-Adresse in der Livegang-Fassung"
  curl -fsS "$B/sitemap.xml" | grep -q '<loc>https://ict-baden.de/produkte/pforte/</loc>' || fail "Sitemap nicht auf ict-baden.de"
fi
echo "Image $IMAGE ($MODE) in Ordnung"
