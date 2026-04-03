#!/usr/bin/env bash
# Task 2 — five consecutive Chromium runs (@ai-heavy excluded); reports stay in this folder
set -euo pipefail
TASK_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$TASK_DIR/../.." && pwd)"
export MEETNIRA_TASK2_DIR="$TASK_DIR"
export MEETNIRA_REPO_ROOT="$REPO_ROOT"
cd "$REPO_ROOT"
mkdir -p "$TASK_DIR/reports/stability-raw"

for i in 1 2 3 4 5; do
  echo "=== Task 2 stability run $i of 5 ==="
  npx donobu test \
    --config "$TASK_DIR/playwright.config.ts" \
    --project=chromium || true
  if [[ -f "$TASK_DIR/reports/last-run.json" ]]; then
    cp "$TASK_DIR/reports/last-run.json" "$TASK_DIR/reports/stability-raw/run-${i}.json"
  fi
done

node "$TASK_DIR/generate-stability-email-report.mjs"
echo "Done. Summary: $TASK_DIR/reports/STABILITY_EMAIL_REPORT.md"
