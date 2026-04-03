# Task 1 — Risk-Based Complete Regression Suite

Donobu Page.AI coverage for the highest-risk free-practice flows: **Learning Friend selection**, **grade → topic → practice**, and **dashboard progress** visibility. The main flow steps run through the Donobu browsing agent so Donobu Studio shows the autonomous tool trace and assertion logs.

## Prerequisites

Install once at the **repository root**: `npm install`

Copy `.env.example` → `.env` if you need `MEETNIRA_BASE_URL` or other env.

## Run (from this folder)

```bash
cd tasks/Task-1-Risk-Based-Complete-Regression-Suite
npm test
```

Or: `./run-tests.sh`

From repo root: `npm test` or `npm run test:task-1` (browsers open on screen by default). Use `npm run test:headless` or `MEETNIRA_HEADLESS=1` to hide them.

## Outputs (under this folder)

- `reports/playwright-report.json`
- `playwright-report/` — `npm run report`
- `test-results/` — on failure (trace, screenshot, video)

## Reports

From this folder:

```bash
npm run report
```

From repo root:

```bash
npm run report:task-1
```

## Parallelism

`playwright.config.ts` is conservative for the live site: `fullyParallel: false`, defaulting to `1` worker on production and scaling up only when you point `MEETNIRA_BASE_URL` at a non-production environment or explicitly set `MEETNIRA_WORKERS`.

## Donobu Studio

Run `npm test`, then review the autonomous flow steps and assertions in Donobu Studio. These tests now use `page.ai(...)` and `page.ai.assert(...)` for the primary journey.
