#!/usr/bin/env zsh
set -euo pipefail

PORT=${PORT:-3000}
LOCK_FILE=".next/dev/lock"

# Kill existing listeners on PORT
if PIDS=$(lsof -i :${PORT} -t 2>/dev/null); then
  if [[ -n "$PIDS" ]]; then
    echo "Killing processes on :$PORT: $PIDS"
    kill -9 $PIDS 2>/dev/null || true
    sleep 0.3
  fi
fi

# Remove stale Next.js dev lock
if [[ -f "$LOCK_FILE" ]]; then
  echo "Removing stale lock $LOCK_FILE"
  rm -f "$LOCK_FILE"
fi

# Start Next dev on the specified PORT
exec next dev --port ${PORT}
