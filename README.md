# MeetNira — Donobu + Playwright regression

End-to-end checks for [MeetNira](https://meetnira.com) using [Donobu](https://www.donobu.com) (Playwright-based runner). The suite is split into **Task 1** (core flows) and **Task 2** (five-run stability + summary report).

---

## Prerequisites

1. **Node.js 20+**
2. From the **repository root**, install dependencies:

   ```bash
   npm install
   ```

3. **Browsers** (first time only, if Playwright prompts or tests fail to launch):

   ```bash
   npx playwright install chromium
   ```

4. **Environment** (optional):

   ```bash
   cp .env.example .env
   ```

   Edit `.env` if you need a non-production target:

   - `MEETNIRA_BASE_URL` — defaults to `https://meetnira.com`
   - `MEETNIRA_HEADLESS=1` — run without opening browser windows (default is **headed** locally)
   - In **CI**, browsers run **headless** automatically when `CI` is set.

---

## What the tests do

All paths use **Try Practice for Free** only (no student/mentor login).

### Task 1 — `tasks/Task-1-Risk-Based-Minimum-Regression-Suite/`

| # | Test | What it validates |
|---|------|-------------------|
| 1 | **Character customization** | Opens home → **Try Practice for Free** → picks **Grade 2** → chooses **Wonder Star** (non-default Learning Friend) → **Start Practicing** → lands on student dashboard with **Your Progress** / domain row and **Your Dashboard** visible. |
| 2 | **Learning flow & progress** | Same entry → **Grade 1** → default friend → dashboard → first topic card → lesson modal → **Practice** → `/student/practice` → selects an MC answer, **Submit**, sees next step → returns to dashboard → progress UI still visible. |

Specs live in `tasks/Task-1-Risk-Based-Minimum-Regression-Suite/tests/core-risk-regression.spec.ts`. Helpers are in `fixtures/`.

### Task 2 — `tasks/Task-2-Stability-Run-1-Before-Code-Changes/`

Runs the **same two tests as Task 1**, **five times in a row** on Chromium (with parallel workers). After each run it saves JSON; at the end it builds a markdown **email-style** summary: pass/fail per run, trend (stable / flaky / degrading), repeated failures, and sample error lines.

---

## How to run the tests

Run commands from the **repository root** unless noted.

### Using npm (recommended)

| Command | Description |
|---------|-------------|
| `npm test` | Run **Task 1** (2 tests). Browsers are **visible** by default. |
| `npm run test:task-1` | Same as `npm test`. |
| `npm run test:headless` | Task 1 with **no** browser windows. |
| `npm run stability:5x` | **Task 2**: five full passes + generate summary under Task 2’s `reports/`. |
| `npm run stability:report` | Regenerate **only** the Task 2 markdown report from existing `run-*.json` files (no test run). |

### From inside each task folder

**Task 1**

```bash
cd tasks/Task-1-Risk-Based-Minimum-Regression-Suite
npm test
# or: bash ./run-tests.sh
```

**Task 2**

```bash
cd tasks/Task-2-Stability-Run-1-Before-Code-Changes
npm run stability:5x
```

---

## Using `npx` directly (equivalent to npm scripts)

Donobu wraps Playwright; use `npx donobu test` with this repo’s config and env vars so reports land in the right folders.

### Task 1

**macOS / Linux** (repo root):

```bash
export MEETNIRA_TASK1_DIR="$PWD/tasks/Task-1-Risk-Based-Minimum-Regression-Suite"
export MEETNIRA_REPO_ROOT="$PWD"
npx donobu test --config=tasks/Task-1-Risk-Based-Minimum-Regression-Suite/playwright.config.ts
```

**Headless:**

```bash
MEETNIRA_HEADLESS=1 MEETNIRA_TASK1_DIR="$PWD/tasks/Task-1-Risk-Based-Minimum-Regression-Suite" MEETNIRA_REPO_ROOT="$PWD" \
  npx donobu test --config=tasks/Task-1-Risk-Based-Minimum-Regression-Suite/playwright.config.ts
```

**Windows (PowerShell)** — adjust paths if needed:

```powershell
$env:MEETNIRA_TASK1_DIR = "$PWD\tasks\Task-1-Risk-Based-Minimum-Regression-Suite"
$env:MEETNIRA_REPO_ROOT = "$PWD"
npx donobu test --config=tasks/Task-1-Risk-Based-Minimum-Regression-Suite/playwright.config.ts
```

### Task 2 (five runs)

The shell script sets `MEETNIRA_TASK2_DIR` and `MEETNIRA_REPO_ROOT` and calls Donobu five times. From repo root:

```bash
bash tasks/Task-2-Stability-Run-1-Before-Code-Changes/run-stability-5x.sh
```

Or use npm: `npm run stability:5x`.

### Regenerate Task 2 email report (no tests)

```bash
node tasks/Task-2-Stability-Run-1-Before-Code-Changes/generate-stability-email-report.mjs
```

(`npm run stability:report` runs this same file.)

---

## How to get reports

Artifacts are **gitignored**; they appear after a run under each task folder.

### Task 1 — after `npm test` or `npx donobu test` (Task 1 config)

| Output | Location |
|--------|----------|
| **JSON** (CI-friendly) | `tasks/Task-1-Risk-Based-Minimum-Regression-Suite/reports/playwright-report.json` |
| **HTML** (interactive) | `tasks/Task-1-Risk-Based-Minimum-Regression-Suite/playwright-report/` |
| **Traces / screenshots / video** (failures) | `tasks/Task-1-Risk-Based-Minimum-Regression-Suite/test-results/` |

**Open the HTML report** (repo root):

```bash
npm run report:task-1
```

Equivalent:

```bash
npx playwright show-report tasks/Task-1-Risk-Based-Minimum-Regression-Suite/playwright-report
```

### Task 2 — after `npm run stability:5x`

| Output | Location |
|--------|----------|
| JSON per run | `tasks/Task-2-Stability-Run-1-Before-Code-Changes/reports/stability-raw/run-1.json` … `run-5.json` |
| Latest single-run JSON | `tasks/Task-2-Stability-Run-1-Before-Code-Changes/reports/last-run.json` |
| **Email-style summary** (pass/fail table, trend, patterns) | `tasks/Task-2-Stability-Run-1-Before-Code-Changes/reports/STABILITY_EMAIL_REPORT.md` |
| **HTML** (last run only) | `tasks/Task-2-Stability-Run-1-Before-Code-Changes/playwright-report/` |

**Open Task 2 HTML report:**

```bash
npm run report:task-2
```

or:

```bash
npx playwright show-report tasks/Task-2-Stability-Run-1-Before-Code-Changes/playwright-report
```

Open `STABILITY_EMAIL_REPORT.md` in any editor or paste into email; regenerate with `npm run stability:report` if you already have the five JSON files.

---

## Quick reference

| Goal | Command |
|------|---------|
| Run core tests | `npm test` |
| Run without UI | `npm run test:headless` |
| Five stability passes + markdown summary | `npm run stability:5x` |
| Refresh summary only | `npm run stability:report` |
| View Task 1 HTML report | `npm run report:task-1` |
| View Task 2 HTML report | `npm run report:task-2` |
| Install Chromium for Playwright | `npx playwright install chromium` |

More maintainer notes: [`AGENTS.md`](AGENTS.md).
