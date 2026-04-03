# Task 2 — Stability Run #1 (Before Code Changes)

Runs a **representative Chromium matrix** across both grade bands using Donobu Page.AI agent flows. Local runs are **headed by default** and use **2 workers** so you can watch multiple browser windows execute at once while Donobu Studio captures the autonomous tool traces and assertions.

## Prerequisites

`npm install` at the **repository root**. Optional `.env` for `MEETNIRA_BASE_URL`.

## Run (from this folder)

```bash
cd tasks/Task-2-Stability-Run-1-Before-Code-Changes
npm run stability:matrix
```

From repo root: `npm run stability:matrix` (headed locally by default). Use `npm run stability:matrix:headless` or `MEETNIRA_HEADLESS=1` to hide the UI.

Default passes: `2`

Override passes:

```bash
MEETNIRA_TASK2_PASSES=3 npm run stability:matrix
```

## Matrix scenarios

- Grade 2 + Wonder Star → dashboard progress visible
- Grade 1 + Sparkle → lower-grade topic selection opens the start-practice modal
- Grade 6 + Cipher → middle-school dashboard loads topic cards
- Grade 8 + Nova → upper-grade standards picker opens from a topic

## Donobu Studio

These scenarios are agent-driven with `page.ai(...)` and `page.ai.assert(...)`, so Donobu Studio should show the browsing-agent steps and test logs for each scenario.

## Outputs (under this folder)

| Path | Contents |
|------|-----------|
| `reports/stability-raw/run-*.json` | Playwright JSON per matrix pass |
| `reports/STABILITY_EMAIL_REPORT.md` | Email-ready summary: pass/fail per pass, trend, repeated scenario failures, notable errors |
| `reports/last-run.json` | Latest single run |
| `playwright-report/` | HTML report for the last run |
| `test-results/` | Failure artifacts |

Regenerate the markdown only: `npm run stability:report` (from this folder) or `npm run stability:report` from repo root.

## Reports

From this folder:

```bash
npm run report
```

From repo root:

```bash
npm run report:task-2
```
