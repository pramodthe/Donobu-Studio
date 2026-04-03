# Repository Guidelines

## Layout

- **Task 1 — Risk-Based Minimum Regression Suite**  
  `tasks/Task-1-Risk-Based-Minimum-Regression-Suite/`  
  Specs in `tests/`, shared helpers in `fixtures/`, Donobu `playwright.config.ts`, outputs under `reports/`, `playwright-report/`, `test-results/`.

- **Task 2 — Stability Run #1**  
  `tasks/Task-2-Stability-Run-1-Before-Code-Changes/`  
  Runs the Task 1 suite **five times** on Chromium, writes `reports/stability-raw/run-*.json` and `reports/STABILITY_EMAIL_REPORT.md`.

## Setup

```bash
npm install
cp .env.example .env   # optional; set MEETNIRA_BASE_URL if not using production
```

## Commands (from repository root)

| Command | Purpose |
|--------|---------|
| `npm test` | Task 1 regression — **headed by default** (visible Chromium; one window per parallel worker) |
| `npm run test:headless` | Task 1 without UI (`MEETNIRA_HEADLESS=1`) |
| `npm run stability:5x` | Task 2 — five consecutive runs + email summary |
| `npm run stability:report` | Regenerate Task 2 email markdown from existing JSON |
| `npm run report:task-1` | Open Task 1 HTML report |
| `npm run report:task-2` | Open Task 2 HTML report (last run) |

Run Task 1 from its folder: `cd tasks/Task-1-Risk-Based-Minimum-Regression-Suite && npm test`

Run Task 2 from its folder: `cd tasks/Task-2-Stability-Run-1-Before-Code-Changes && npm run stability:5x`

## Style

TypeScript, 2-space indent, Donobu `test` / `expect`, `data-testid` selectors with text failover where needed.
