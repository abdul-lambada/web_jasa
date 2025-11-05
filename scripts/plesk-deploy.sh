#!/usr/bin/env bash
set -euo pipefail

# Plesk Git Deployment Script
# Usage:
#   ./scripts/plesk-deploy.sh [TARGET_DIR]
#   or set env PL_TARGET=/path/to/httpdocs
#
# It will:
# - Build the Vite project with VITE_BASE=/ (root of subdomain)
# - Sync dist/ -> $TARGET_DIR (httpdocs)
# - Copy api/ and admin/ if present
# - Copy public/favicon.svg and public/.htaccess (if exist)
#
# Notes:
# - Requires node and npm available on the server (Plesk Node.js extension).
# - Safe to re-run; rsync will --delete outdated assets.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="${1:-${PL_TARGET:-}}"
# Fallback: use $HOME/httpdocs (Plesk typical subdomain DocumentRoot)
if [[ -z "${TARGET_DIR}" ]]; then
  if [[ -n "${HOME:-}" ]]; then
    TARGET_DIR="${HOME%/}/httpdocs"
    echo "[deploy] Using default TARGET_DIR=$TARGET_DIR"
  else
    echo "[deploy] ERROR: Missing TARGET_DIR. Pass as argument or set PL_TARGET env." >&2
    exit 2
  fi
fi

export VITE_BASE="/"
export NPM_CONFIG_PRODUCTION=false

cd "$ROOT_DIR"

if [[ ! -f package.json ]]; then
  echo "[deploy] ERROR: package.json not found in $ROOT_DIR" >&2
  exit 3
fi

# Detect npm path (Plesk often installs Node under /opt/plesk/node/*/bin)
find_npm() {
  if command -v npm >/dev/null 2>&1; then echo "npm"; return; fi
  for v in 22 20 18 16; do
    if [[ -x "/opt/plesk/node/${v}/bin/npm" ]]; then echo "/opt/plesk/node/${v}/bin/npm"; return; fi
  done
  # Some Plesk installs keep only 'node', try npx as fallback
  if command -v npx >/dev/null 2>&1; then echo "npx --yes npm"; return; fi
  echo ""; return 1
}

NPM_BIN="$(find_npm || true)"
if [[ -z "$NPM_BIN" ]]; then
  echo "[deploy] ERROR: npm not found in PATH or /opt/plesk/node/*/bin. Enable Node.js extension or set NPM_BIN manually." >&2
  exit 4
fi

echo "[deploy] Using NPM: $NPM_BIN"
echo "[deploy] npm ci"
eval "$NPM_BIN ci"

echo "[deploy] npm run build"
eval "$NPM_BIN run build"

mkdir -p "$TARGET_DIR"

echo "[deploy] Sync dist -> $TARGET_DIR"
rsync -a --delete "dist/" "$TARGET_DIR/"

if [[ -d "api" ]]; then
  echo "[deploy] Copy api/"
  rsync -a "api/" "$TARGET_DIR/api/"
fi
if [[ -d "admin" ]]; then
  echo "[deploy] Copy admin/"
  rsync -a "admin/" "$TARGET_DIR/admin/"
fi

if [[ -f "public/favicon.svg" ]]; then
  echo "[deploy] Copy favicon.svg"
  install -D -m 0644 "public/favicon.svg" "$TARGET_DIR/favicon.svg"
fi
if [[ -f "public/.htaccess" ]]; then
  echo "[deploy] Copy .htaccess"
  install -D -m 0644 "public/.htaccess" "$TARGET_DIR/.htaccess"
fi

echo "[deploy] Done -> $TARGET_DIR"
