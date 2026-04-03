#!/usr/bin/env bash
# Artifacts go under this folder; Donobu runs with repo root as cwd so npx resolves.
set -euo pipefail
TASK_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$TASK_DIR/../.." && pwd)"
export MEETNIRA_TASK1_DIR="$TASK_DIR"
export MEETNIRA_REPO_ROOT="$REPO_ROOT"
cd "$REPO_ROOT"
mkdir -p "$TASK_DIR/reports"
exec npx donobu test --config "$TASK_DIR/playwright.config.ts"
