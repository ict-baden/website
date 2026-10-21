# ICT Baden – Website als Image (nginx + gebaute Seite). Gebaut von der CI bei jedem Push auf main und als
# ghcr.io/ict-baden/website:latest veröffentlicht; Watchtower auf docker01 holt neue Versionen von selbst.
#
#   docker build -f deploy/Dockerfile --build-arg REV=$(git rev-parse --short HEAD) --build-arg SITE_STAGING=1 .
#   docker build -f deploy/Dockerfile --build-arg SITE_STAGING=0 --build-arg DIST=dist-live .   # Livegang
#
# Erwartet die gebaute Seite in dist/ (npm run build) bzw. dist-live/. Mit SITE_STAGING=0 (Livegang) entfallen die mit
# "# STAGING" markierten Zeilen der nginx-Konfiguration.
FROM nginx:1.27-alpine

ARG REV=lokal
ARG SITE_STAGING=1
# Ordner mit der gebauten Seite: dist (Vorschau) oder dist-live (Livegang, SITE_STAGING=0 SITE_URL=https://ict-baden.de)
ARG DIST=dist

# Schutz gegen vertauschte Argumente: die Livegang-Seite nie mit der noindex-Konfiguration und umgekehrt
RUN if [ "$DIST" = dist-live ] && [ "$SITE_STAGING" != 0 ]; then echo 'DIST=dist-live braucht SITE_STAGING=0' >&2; exit 1; fi; \
    if [ "$DIST" = dist ] && [ "$SITE_STAGING" = 0 ]; then echo 'SITE_STAGING=0 braucht DIST=dist-live' >&2; exit 1; fi
COPY deploy/nginx.conf /tmp/default.conf
RUN if [ "$SITE_STAGING" = "0" ]; then grep -v '# STAGING' /tmp/default.conf > /etc/nginx/conf.d/default.conf; \
    else cp /tmp/default.conf /etc/nginx/conf.d/default.conf; fi \
 && rm /tmp/default.conf

COPY ${DIST}/ /usr/share/nginx/html/current/
# Welcher Commit läuft: https://<host>/version.txt
RUN echo "$REV" > /usr/share/nginx/html/current/version.txt \
 && nginx -t -q

LABEL org.opencontainers.image.source="https://github.com/ict-baden/website" \
      org.opencontainers.image.description="ICT Baden – Website (statisch, nginx)" \
      org.opencontainers.image.revision="$REV" \
      de.ict-baden.staging="$SITE_STAGING"

HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/health || exit 1
