#!/usr/bin/env bash
# Richtet den Autodeploy der Vorschau auf docker01 ein (einmalig, als root): Skript, systemd-Service und -Timer.
# Danach prüft docker01 alle 5 Minuten, ob auf main ein neuer, in der CI grüner Commit liegt (siehe autodeploy.sh).
#
#   scp -r deploy/autodeploy root@docker01:/tmp/ && ssh root@docker01 bash /tmp/autodeploy/install.sh
set -euo pipefail
BASE=/srv/docker/ictbaden.netgetvpn.de
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$BASE/autodeploy"
install -m 0755 "$HERE/autodeploy.sh" "$BASE/autodeploy/autodeploy.sh"

cat > /etc/systemd/system/ictbaden-autodeploy.service <<EOF
[Unit]
Description=ICT Baden Website: Autodeploy der Vorschau (main, CI grün)
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
Environment=BASE=$BASE
ExecStart=$BASE/autodeploy/autodeploy.sh
TimeoutStartSec=900
EOF

cat > /etc/systemd/system/ictbaden-autodeploy.timer <<'EOF'
[Unit]
Description=ICT Baden Website: alle 5 Minuten auf neue Commits prüfen

[Timer]
OnBootSec=2min
OnUnitActiveSec=5min
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now ictbaden-autodeploy.timer
systemctl list-timers ictbaden-autodeploy.timer --no-pager
