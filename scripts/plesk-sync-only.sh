#!/usr/bin/env bash
set -euo pipefail
# Plesk sync-only deploy (tanpa build). Asumsikan dist/ sudah ada di repo.
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET_DIR="${1:-${PL_TARGET:-}}"
if [[ -z "${TARGET_DIR}" ]]; then
  if [[ -n "${HOME:-}" ]]; then
    TARGET_DIR="${HOME%/}/httpdocs"
    echo "[sync] Using default TARGET_DIR=$TARGET_DIR"
  else
    echo "[sync] ERROR: Missing TARGET_DIR. Pass as argument or set PL_TARGET env." >&2
    exit 2
  fi
fi
cd "$ROOT_DIR"

[ -d "dist" ] || { echo "[sync] ERROR: dist/ not found. Build locally then commit/push dist first." >&2; exit 3; }

mkdir -p "$TARGET_DIR"
echo "[sync] rsync dist -> $TARGET_DIR"
rsync -a --delete "dist/" "$TARGET_DIR/"

if [[ -d "api" ]]; then
  echo "[sync] Copy api/"
  rsync -a "api/" "$TARGET_DIR/api/"
fi
if [[ -d "admin" ]]; then
  echo "[sync] Copy admin/"
  rsync -a "admin/" "$TARGET_DIR/admin/"
fi

if [[ -f "public/favicon.svg" ]]; then
  echo "[sync] Copy favicon.svg"
  install -D -m 0644 "public/favicon.svg" "$TARGET_DIR/favicon.svg"
fi
if [[ -f "public/.htaccess" ]]; then
  echo "[sync] Copy .htaccess"
  install -D -m 0644 "public/.htaccess" "$TARGET_DIR/.htaccess"
fi

echo "[sync] Done -> $TARGET_DIR"
