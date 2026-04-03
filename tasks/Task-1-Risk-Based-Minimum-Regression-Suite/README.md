# Task 1 — Risk-Based Minimum Regression Suite

Deterministic Donobu + Playwright coverage for the highest-risk free-practice flows: **Learning Friend selection**, **grade → topic → practice → submit**, and **dashboard progress** visibility.

## Prerequisites

Install once at the **repository root**: `npm install`

Copy `.env.example` → `.env` if you need `MEETNIRA_BASE_URL` or other env.

## Run (from this folder)

```bash
cd tasks/Task-1-Risk-Based-Minimum-Regression-Suite
npm test
```

Or: `./run-tests.sh`

From repo root: `npm test` or `npm run test:task-1` (browsers open on screen by default). Use `npm run test:headless` or `MEETNIRA_HEADLESS=1` to hide them.

## Outputs (under this folder)

- `reports/playwright-report.json`
- `playwright-report/` — `npm run report`
- `test-results/` — on failure (trace, screenshot, video)

## Parallelism

`playwright.config.ts` uses `fullyParallel: true` and caps workers with `os.availableParallelism()` (min 2, max 8; CI: 4).

## Donobu Studio

Record or refine flows in [Donobu Studio](https://www.donobu.com) and keep selectors aligned with production `data-testid` values in `fixtures/`.
