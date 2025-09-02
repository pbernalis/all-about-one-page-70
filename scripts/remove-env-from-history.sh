#!/usr/bin/env bash
set -euo pipefail

if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "Please install git-filter-repo: https://github.com/newren/git-filter-repo" >&2
  exit 1
fi

FILE_PATH=${1:-.env}

echo "Rewriting history to remove ${FILE_PATH}..."
git filter-repo --invert-paths --path "${FILE_PATH}"

echo "Force-push your branches (e.g., origin main) after verifying locally."