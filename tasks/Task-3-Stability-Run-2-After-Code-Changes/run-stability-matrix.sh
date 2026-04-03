#!/usr/bin/env bash
set -euo pipefail
TASK_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$TASK_DIR/../.." && pwd)"
export MEETNIRA_TASK3_DIR="$TASK_DIR"
export MEETNIRA_REPO_ROOT="$REPO_ROOT"
export MEETNIRA_HEADLESS="${MEETNIRA_HEADLESS:-0}"
PASSES="${MEETNIRA_TASK3_PASSES:-2}"
cd "$REPO_ROOT"
mkdir -p "$TASK_DIR/reports/stability-raw"

find "$TASK_DIR/reports/stability-raw" -maxdepth 1 -name 'run-*.json' -delete

for ((i=1; i<=PASSES; i+=1)); do
  echo "=== Task 3 matrix pass $i of $PASSES ==="
  npx donobu test \
    --config "$TASK_DIR/playwright.config.ts" \
    --project=chromium || true
  if [[ -f "$TASK_DIR/reports/last-run.json" ]]; then
    cp "$TASK_DIR/reports/last-run.json" "$TASK_DIR/reports/stability-raw/run-${i}.json"
  fi
done

node "$TASK_DIR/generate-stability-email-report.mjs"
echo "Done. Summary: $TASK_DIR/reports/STABILITY_EMAIL_REPORT.md"
