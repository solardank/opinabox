#!/usr/bin/env bash
# start.sh - entrypoint to start Xvfb and supervisord (ASCII only, LF endings)

set -euo pipefail

export DISPLAY="${DISPLAY:-:1}"

# Ensure the workspace user and log dir exist
mkdir -p /var/log/onionpress
chown -R workspace:workspace /var/log/onionpress 2>/dev/null || true
if [ -d "/home/workspace" ]; then
  chown -R workspace:workspace /home/workspace 2>/dev/null || true
fi

# Replace websockify path in supervisord.conf if venv exists
if [ -x /opt/venv/bin/websockify ]; then
  sed -i 's|/usr/local/bin/websockify|/opt/venv/bin/websockify|g' /etc/supervisor/conf.d/supervisord.conf 2>/dev/null || true
fi

# Start Xvfb on display :1 if not already running
if ! pgrep -f "Xvfb :1" >/dev/null 2>&1; then
  echo "Starting Xvfb on display ${DISPLAY}..."
  Xvfb "${DISPLAY#*:}" -screen 0 1366x768x24 >/var/log/onionpress/xvfb.log 2>&1 &
  sleep 1
fi

# Start supervisord (it will run x11vnc, websockify, xfce, toolbar server)
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
