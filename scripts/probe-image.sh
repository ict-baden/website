#!/usr/bin/env bash
# Startet ein gebautes Website-Image einmal und prüft, dass nginx-Konfiguration und Seite zusammenpassen.
#   scripts/probe-image.sh <image> staging|live <commit>
# beide:   Seiten (auch die Adressen, die die Apps verlinken: /impressum/, /datenschutz/<app>/, /produkte/<slug>/),
#          Produktübersicht, Weiterleitungen, 410, www → Hauptadresse, HSTS (max-age=31536000, ohne includeSubDomains).
# staging: X-Robots-Tag noindex auf jeder Antwort, robots.txt sperrt alles, jeder Host wird bedient (Vorschau).
# live:    kein X-Robots-Tag, kein <meta name="robots" content="noindex">, robots.txt ohne "Disallow: /",
#          kanonische Adresse, hreflang und Sitemap auf https://ict-baden.de; jeder andere Host (Alias-Domains, IP)
#          → 301 auf https://ict-baden.de, /health unter jeder Adresse.
set -euo pipefail
IMAGE="$1"; MODE="$2"; REV="$3"
NAME="probe-$MODE-$$"
docker run --rm -d --name "$NAME" -p 127.0.0.1::80 "$IMAGE" >/dev/null
trap 'docker rm -f "$NAME" >/dev/null 2>&1 || true' EXIT
PORT="$(docker port "$NAME" 80/tcp | head -1 | sed 's/.*://')"
B="http://127.0.0.1:$PORT"
for _ in $(seq 1 30); do curl -fsS "$B/health" >/dev/null 2>&1 && break; sleep 1; done

# Das Live-Image bedient nur ict-baden.de; alle Prüfungen der Seite laufen deshalb mit diesem Host-Kopf
if [ "$MODE" = live ]; then H=(-H 'Host: ict-baden.de'); else H=(-H 'Host: ictbaden.netgetvpn.de'); fi
fail() { echo "FEHLER ($MODE): $*" >&2; exit 1; }
# Antworten immer erst ganz lesen und dann durchsuchen (grep … <<<"$(curl …)"): „curl … | grep -q“ scheitert unter
# pipefail sporadisch, wenn grep früh fündig wird und curl beim Weiterschreiben SIGPIPE bekommt
get() { curl -fsS "${H[@]}" "$B$1"; }
code() { curl -s -o /dev/null -w '%{http_code}' "${H[@]}" "$B$1"; }
loc() { curl -s -o /dev/null -w '%{redirect_url}' "${H[@]}" "$B$1" | sed "s#^$B##"; }
expect() { local c; c="$(code "$1")"; [ "$c" = "$2" ] || fail "$1 → $c statt $2"; }
redirect() { expect "$1" 301; local l; l="$(loc "$1")"; [ "$l" = "$2" ] || fail "$1 → $l statt $2"; }
# Weiterleitung bei einem bestimmten Host-Kopf: hostredirect <host> <pfad> <ziel>
hostredirect() {
  local r; r="$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -H "Host: $1" "$B$2")"
  [ "$r" = "301 $3" ] || fail "Host $1$2 → $r statt 301 $3"
}

[ "$(get /version.txt)" = "$REV" ] || fail "version.txt"
expect / 200
expect /en/ 200
expect /produkte/ 200
expect /en/products/ 200
for p in vitrine riegel zutritt lupe pforte industrial-keyboard plakette; do
  expect "/produkte/$p/" 200
  expect "/en/products/$p/" 200
done
for a in vitrine lupe zutritt riegel plakette pforte industrialkeyboard; do expect "/datenschutz/$a/" 200; done
expect /impressum/ 200
expect /datenschutz/ 200
redirect /impressum /impressum/
redirect /produkte /produkte/
redirect /en/products /en/products/
redirect /produkte/industrialkeyboard /produkte/industrial-keyboard/
redirect /produkte/haertungs-check/ /produkte/riegel/
redirect /produkte/labeldesigner/ /produkte/plakette/
redirect /produkte/enterprisebrowser/ /produkte/pforte/
redirect /en/products/enterprisebrowser/ /en/products/pforte/
redirect /datenschutz/enterprisebrowser/ /datenschutz/pforte/
redirect '/index.html?page=contact' '/#kontakt'
redirect /leistungen/ '/#leistungen'
expect /produkte/hausmeister/ 410
expect /produkte/s7-explorer 410
expect /en/products/lotse/ 410
expect /gibt-es-nicht/ 404
expect /en/gibt-es-nicht/ 404
grep -q 'Page not found' <<<"$(curl -s "${H[@]}" "$B/en/gibt-es-nicht/")" || fail "404-Seite ohne englischen Text"
# www → Hauptadresse (beide Fassungen)
hostredirect www.ict-baden.de /produkte/vitrine/ https://ict-baden.de/produkte/vitrine/

# HSTS auf jeder Antwort, ohne includeSubDomains (Subdomains wie mail.ict-baden.de sind nicht geprüft)
HEAD="$(curl -sI "${H[@]}" "$B/")"
grep -qi '^strict-transport-security: max-age=31536000' <<<"$HEAD" || fail "Strict-Transport-Security fehlt"
grep -qi '^strict-transport-security:.*includesubdomains' <<<"$HEAD" && fail "HSTS mit includeSubDomains"
grep -qi '^strict-transport-security: max-age=31536000' <<<"$(curl -sI "${H[@]}" "$B/produkte/haertungs-check/")" || fail "HSTS fehlt bei Weiterleitungen"

ROBOTS="$(get /robots.txt)"
HOMEPAGE="$(get /)"
PRODUCT="$(get /produkte/vitrine/)"
if [ "$MODE" = staging ]; then
  grep -qi '^x-robots-tag: *noindex' <<<"$HEAD" || fail "X-Robots-Tag noindex fehlt"
  grep -qi '^x-robots-tag: *noindex' <<<"$(curl -sI "${H[@]}" "$B/produkte/vitrine/")" || fail "X-Robots-Tag noindex fehlt auf Produktseite"
  grep -q '^Disallow: /$' <<<"$ROBOTS" || fail "robots.txt sperrt nicht"
  grep -q 'name="robots" content="noindex' <<<"$HOMEPAGE" || fail "meta noindex fehlt"
  # Die Vorschau bedient jeden Host (Tunnel-Hostname, Prüfung über die IP) und leitet nur www um
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$B/produkte/vitrine/")" = 200 ] || fail "Vorschau über 127.0.0.1 nicht erreichbar"
else
  grep -qi '^x-robots-tag' <<<"$HEAD" && fail "X-Robots-Tag in der Livegang-Fassung"
  grep -qi '^x-robots-tag' <<<"$(curl -sI "${H[@]}" "$B/produkte/vitrine/")" && fail "X-Robots-Tag auf Produktseite"
  grep -q '^Disallow: */ *$' <<<"$ROBOTS" && fail "robots.txt enthält Disallow: /"
  grep -q '^Sitemap: https://ict-baden.de/sitemap.xml$' <<<"$ROBOTS" || fail "robots.txt ohne Sitemap auf ict-baden.de"
  grep -qi 'name="robots"[^>]*noindex' <<<"$HOMEPAGE$PRODUCT" && fail "meta noindex in der Livegang-Fassung"
  grep -q '<link rel="canonical" href="https://ict-baden.de/produkte/vitrine/"' <<<"$PRODUCT" || fail "canonical nicht auf ict-baden.de"
  grep -q 'hreflang="en" href="https://ict-baden.de/en/products/vitrine/"' <<<"$PRODUCT" || fail "hreflang nicht auf ict-baden.de"
  grep -q 'netgetvpn' <<<"$HOMEPAGE$PRODUCT$ROBOTS$(get /sitemap.xml)" && fail "Vorschau-Adresse in der Livegang-Fassung"
  SITEMAP="$(get /sitemap.xml)"
  grep -q '<loc>https://ict-baden.de/produkte/pforte/</loc>' <<<"$SITEMAP" || fail "Sitemap nicht auf ict-baden.de"
  grep -q '<loc>https://ict-baden.de/en/products/</loc>' <<<"$SITEMAP" || fail "Produktübersicht nicht in der Sitemap"
  # Jeder andere Host → https://ict-baden.de mit Pfad und Abfrage; auch die Weiterleitung trägt HSTS
  for h in ict-baden.com ictbaden.de it-baden.de itbaden.de itbaden.org preview.example 192.168.4.6; do
    hostredirect "$h" '/produkte/vitrine/?ref=alt' 'https://ict-baden.de/produkte/vitrine/?ref=alt'
  done
  hostredirect www.ict-baden.de / https://ict-baden.de/
  [ "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$B/en/")" = "301 https://ict-baden.de/en/" ] || fail "Zugriff über die IP leitet nicht auf ict-baden.de um"
  grep -qi '^strict-transport-security: max-age=31536000' <<<"$(curl -sI -H 'Host: ictbaden.de' "$B/")" || fail "HSTS fehlt bei der Host-Weiterleitung"
  # Gesundheitsprüfung (Docker: 127.0.0.1, deploy.sh: 192.168.4.6) bleibt unter jeder Adresse erreichbar
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$B/health")" = 200 ] || fail "/health über die IP nicht erreichbar"
  [ "$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: itbaden.org' "$B/health")" = 200 ] || fail "/health mit fremdem Host nicht erreichbar"
fi
echo "Image $IMAGE ($MODE) in Ordnung"
