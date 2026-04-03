#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

HEADLESS="${MEETNIRA_HEADLESS:-0}"
DEVICE_MODE="${MEETNIRA_DEVICE:-desktop}"
OPEN_REPORTS=1

TASK1_REPORT_PORT="${TASK1_REPORT_PORT:-9321}"
TASK2_REPORT_PORT="${TASK2_REPORT_PORT:-9322}"
TASK3_REPORT_PORT="${TASK3_REPORT_PORT:-9323}"
TASK4_REPORT_PORT="${TASK4_REPORT_PORT:-9324}"
REPORT_HOST="${REPORT_HOST:-127.0.0.1}"

for arg in "$@"; do
  case "$arg" in
    --headless)
      HEADLESS=1
      ;;
    --mobile)
      DEVICE_MODE=mobile
      ;;
    --no-reports)
      OPEN_REPORTS=0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Usage: ./run.sh [--headless] [--mobile] [--no-reports]" >&2
      exit 1
      ;;
  esac
done

run_task() {
  local label="$1"
  shift

  echo
  echo "=== $label ==="
  "$@"
}

open_report() {
  local label="$1"
  local report_dir="$2"
  local port="$3"

  if [[ ! -d "$report_dir" ]]; then
    echo "Skipping $label report. Directory not found: $report_dir"
    return
  fi

  echo "Serving $label report at http://$REPORT_HOST:$port"
  npx playwright show-report "$report_dir" --host "$REPORT_HOST" --port "$port" >/tmp/"$(basename "$report_dir")-$port.log" 2>&1 &
  REPORT_PIDS+=("$!")
}

cleanup() {
  if [[ ${#REPORT_PIDS[@]} -gt 0 ]]; then
    kill "${REPORT_PIDS[@]}" >/dev/null 2>&1 || true
  fi
}

REPORT_PIDS=()
trap cleanup EXIT

if [[ "$HEADLESS" == "1" ]]; then
  run_task "Task 1" env MEETNIRA_HEADLESS=1 MEETNIRA_DEVICE="$DEVICE_MODE" npm test
  run_task "Task 2" env MEETNIRA_HEADLESS=1 MEETNIRA_DEVICE="$DEVICE_MODE" npm run stability:matrix
  run_task "Task 3" env MEETNIRA_HEADLESS=1 MEETNIRA_DEVICE="$DEVICE_MODE" npm run stability:after
  run_task "Task 4" env MEETNIRA_HEADLESS=1 MEETNIRA_DEVICE="$DEVICE_MODE" npm run test:task-4
else
  run_task "Task 1" env MEETNIRA_DEVICE="$DEVICE_MODE" npm test
  run_task "Task 2" env MEETNIRA_DEVICE="$DEVICE_MODE" npm run stability:matrix
  run_task "Task 3" env MEETNIRA_DEVICE="$DEVICE_MODE" npm run stability:after
  run_task "Task 4" env MEETNIRA_DEVICE="$DEVICE_MODE" npm run test:task-4
fi

if [[ "$OPEN_REPORTS" != "1" ]]; then
  echo
  echo "All tests completed. Report servers were skipped."
  exit 0
fi

echo
echo "=== HTML Reports ==="
echo "Device mode: $DEVICE_MODE"

open_report \
  "Task 1" \
  "$ROOT_DIR/tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright-report" \
  "$TASK1_REPORT_PORT"
open_report \
  "Task 2" \
  "$ROOT_DIR/tasks/Task-2-Stability-Run-1-Before-Code-Changes/playwright-report" \
  "$TASK2_REPORT_PORT"
open_report \
  "Task 3" \
  "$ROOT_DIR/tasks/Task-3-Stability-Run-2-After-Code-Changes/playwright-report" \
  "$TASK3_REPORT_PORT"
open_report \
  "Task 4" \
  "$ROOT_DIR/tasks/Task-4-Negative-Path-Matrix/playwright-report" \
  "$TASK4_REPORT_PORT"

echo
echo "Reports are running. Press Ctrl-C to stop all report servers."
wait
