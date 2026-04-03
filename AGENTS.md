# Repository Guidelines

## Layout

- **Task 1 — Risk-Based Complete Regression Suite**  
  `tasks/Task-1-Risk-Based-Complete-Regression-Suite/`  
  Specs in `tests/`, shared helpers in `fixtures/`, Donobu `playwright.config.ts`, outputs under `reports/`, `playwright-report/`, `test-results/`. The current task specs are Donobu Page.AI driven so Studio shows browsing-agent steps and assertions.

- **Task 2 — Stability Run #1**  
  `tasks/Task-2-Stability-Run-1-Before-Code-Changes/`  
  Runs a **headed representative matrix** across lower- and upper-grade flows, writes `reports/stability-raw/run-*.json` and `reports/STABILITY_EMAIL_REPORT.md`.

- **Task 3 — Stability Run #2 (After Code Changes)**  
  `tasks/Task-3-Stability-Run-2-After-Code-Changes/`  
  Runs the post-change headed Donobu matrix, writes `reports/stability-raw/run-*.json` and `reports/STABILITY_EMAIL_REPORT.md`.

- **Task 4 — Negative Path Matrix**  
  `tasks/Task-4-Negative-Path-Matrix/`  
  Runs Donobu negative-path coverage for gating and guest-state behavior, with outputs under `reports/`, `playwright-report/`, and `test-results/`.

## Setup

```bash
npm install
cp .env.example .env   # optional; set MEETNIRA_BASE_URL if not using production
```

## Commands (from repository root)

| Command | Purpose |
|--------|---------|
| `npm test` | Task 1 regression — **headed by default** (visible Chromium; one window per parallel worker) |
| `npm run test:task-4` | Task 4 negative-path matrix |
| `npm run test:headless` | Task 1 without UI (`MEETNIRA_HEADLESS=1`) |
| `npm run stability:matrix` | Task 2 — headed multi-scenario matrix + email summary |
| `npm run stability:matrix:headless` | Task 2 without UI |
| `npm run stability:after` | Task 3 — post-change headed matrix + email summary |
| `npm run stability:after:headless` | Task 3 without UI |
| `npm run stability:report` | Regenerate Task 2 email markdown from existing JSON |
| `npm run report:task-1` | Open Task 1 HTML report |
| `npm run report:task-2` | Open Task 2 HTML report (last run) |
| `npm run report:task-3` | Open Task 3 HTML report |
| `npm run report:task-4` | Open Task 4 HTML report |

Run Task 1 from its folder: `cd tasks/Task-1-Risk-Based-Complete-Regression-Suite && npm test`

Run Task 2 from its folder: `cd tasks/Task-2-Stability-Run-1-Before-Code-Changes && npm run stability:matrix`

Run Task 3 from its folder: `cd tasks/Task-3-Stability-Run-2-After-Code-Changes && npm run stability:after`

Run Task 4 from its folder: `cd tasks/Task-4-Negative-Path-Matrix && npm test`

## Style

TypeScript, 2-space indent, Donobu `test` / `expect`, `data-testid` selectors with text failover where needed.
