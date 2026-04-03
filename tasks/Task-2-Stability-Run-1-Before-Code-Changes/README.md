# Task 2 — Stability Run #1 (Before Code Changes)

Runs the **Task 1 regression suite** **five consecutive times** on **Chromium**, with **parallel workers** (`fullyParallel` + CPU cap in `playwright.config.ts`).

## Prerequisites

`npm install` at the **repository root**. Optional `.env` for `MEETNIRA_BASE_URL`.

## Run (from this folder)

```bash
cd tasks/Task-2-Stability-Run-1-Before-Code-Changes
npm run stability:5x
```

From repo root: `npm run stability:5x` (headed locally like Task 1 — set `MEETNIRA_HEADLESS=1` to avoid windows).

## Outputs (under this folder)

| Path | Contents |
|------|-----------|
| `reports/stability-raw/run-1.json` … `run-5.json` | Playwright JSON per run |
| `reports/STABILITY_EMAIL_REPORT.md` | Email-ready summary: pass/fail per run, trend, repeated failures, notable errors |
| `reports/last-run.json` | Latest single run |
| `playwright-report/` | HTML report for the last run |
| `test-results/` | Failure artifacts |

Regenerate the markdown only: `npm run stability:report` (from this folder) or `npm run stability:report` from repo root.
