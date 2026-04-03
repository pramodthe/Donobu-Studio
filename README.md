# MeetNira — Donobu agent regression

End-to-end checks for [MeetNira](https://meetnira.com) using [Donobu](https://www.donobu.com). The active suites are Donobu Page.AI driven so Donobu Studio shows the browsing-agent steps, assertions, and logs. The repo is split into **Task 1** (core flows), **Task 2** (pre-change stability matrix), **Task 3** (post-change stability matrix), and **Task 4** (negative-path matrix).

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

### Task 1 — `tasks/Task-1-Risk-Based-Complete-Regression-Suite/`

| # | Test | What it validates |
|---|------|-------------------|
| 1 | **Character customization** | Uses Donobu Page.AI to open home → **Try Practice for Free** → pick **Grade 2** → choose **Wonder Star** → continue to the student dashboard and assert dashboard/progress visibility. |
| 2 | **Learning flow & progress** | Uses Donobu Page.AI to open home → **Try Practice for Free** → pick **Grade 1** → continue into a topic/practice path and assert the student flow remains visible. |

Specs live in `tasks/Task-1-Risk-Based-Complete-Regression-Suite/tests/core-risk-regression.spec.ts`. Helpers are in `fixtures/`.

### Task 2 — `tasks/Task-2-Stability-Run-1-Before-Code-Changes/`

Runs a **headed Donobu Page.AI representative matrix** before code changes. It covers lower-grade and upper-grade flows instead of rerunning the same single path only. After each pass it saves JSON; at the end it builds a markdown **email-style** summary.

Representative scenarios:

- Grade 2 + Wonder Star → dashboard progress visible
- Grade 1 + Sparkle → topic selection opens start-practice modal
- Grade 6 + Cipher → middle-school dashboard loads topic cards
- Grade 8 + Nova → standards picker opens from a topic

### Task 3 — `tasks/Task-3-Stability-Run-2-After-Code-Changes/`

Runs the same style of **headed Donobu Page.AI matrix after code changes** so you can compare post-change stability against the earlier run.

### Task 4 — `tasks/Task-4-Negative-Path-Matrix/`

Runs **Donobu Page.AI negative-path coverage** for key gates and guest-state behavior:

- Continue remains unavailable before picking a grade
- Start Practicing remains unavailable before picking a learning friend
- Free-practice dashboard still behaves like a guest flow
- No topic start-practice modal appears before opening a topic

---

## How to run the tests

Run commands from the **repository root** unless noted.

### One command for everything

```bash
./run.sh
```

This runs Task 1, Task 2, Task 3, and Task 4 in sequence using the active root scripts, then serves each Playwright HTML report on its own local port:

- Task 1 report: `http://127.0.0.1:9321`
- Task 2 report: `http://127.0.0.1:9322`
- Task 3 report: `http://127.0.0.1:9323`
- Task 4 report: `http://127.0.0.1:9324`

Options:

- `./run.sh --headless` to run all tasks without visible browser windows
- `./run.sh --no-reports` to skip opening the HTML report servers

Override ports if needed:

```bash
TASK1_REPORT_PORT=9401 TASK2_REPORT_PORT=9402 TASK3_REPORT_PORT=9403 TASK4_REPORT_PORT=9404 ./run.sh
```

### Using npm (recommended)

| Command | Description |
|---------|-------------|
| `npm test` | Run **Task 1** (2 tests). Browsers are **visible** by default. |
| `npm run test:task-1` | Same as `npm test`. |
| `npm run test:task-4` | Run **Task 4** negative-path matrix. |
| `npm run test:headless` | Task 1 with **no** browser windows. |
| `npm run stability:matrix` | **Task 2**: headed pre-change matrix + markdown summary. |
| `npm run stability:matrix:headless` | Task 2 without visible browser windows. |
| `npm run stability:5x` | Alias of `npm run stability:matrix`. |
| `npm run stability:after` | **Task 3**: headed post-change matrix + markdown summary. |
| `npm run stability:after:headless` | Task 3 without visible browser windows. |
| `npm run stability:report` | Regenerate **only** the Task 2 markdown report from existing `run-*.json` files (no test run). |
| `npm run report:task-1` | Open Task 1 HTML report. |
| `npm run report:task-2` | Open Task 2 HTML report. |
| `npm run report:task-3` | Open Task 3 HTML report. |
| `npm run report:task-4` | Open Task 4 HTML report. |

### From inside each task folder

**Task 1**

```bash
cd tasks/Task-1-Risk-Based-Complete-Regression-Suite
npm test
# or: bash ./run-tests.sh
```

**Task 2**

```bash
cd tasks/Task-2-Stability-Run-1-Before-Code-Changes
npm run stability:matrix
```

**Task 3**

```bash
cd tasks/Task-3-Stability-Run-2-After-Code-Changes
npm run stability:after
```

**Task 4**

```bash
cd tasks/Task-4-Negative-Path-Matrix
npm test
```

---

## Using `npx` directly (equivalent to npm scripts)

Donobu wraps Playwright; use `npx donobu test` with this repo’s config and env vars so reports land in the right folders.

### Task 1

**macOS / Linux** (repo root):

```bash
export MEETNIRA_TASK1_DIR="$PWD/tasks/Task-1-Risk-Based-Complete-Regression-Suite"
export MEETNIRA_REPO_ROOT="$PWD"
npx donobu test --config=tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright.config.ts
```

**Headless:**

```bash
MEETNIRA_HEADLESS=1 MEETNIRA_TASK1_DIR="$PWD/tasks/Task-1-Risk-Based-Complete-Regression-Suite" MEETNIRA_REPO_ROOT="$PWD" \
  npx donobu test --config=tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright.config.ts
```

**Windows (PowerShell)** — adjust paths if needed:

```powershell
$env:MEETNIRA_TASK1_DIR = "$PWD\tasks\Task-1-Risk-Based-Complete-Regression-Suite"
$env:MEETNIRA_REPO_ROOT = "$PWD"
npx donobu test --config=tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright.config.ts
```

### Task 1 — run one test or one file (`npx`)

Set env once per shell (macOS / Linux from repo root), then add a path or `-g`:

```bash
export MEETNIRA_TASK1_DIR="$PWD/tasks/Task-1-Risk-Based-Complete-Regression-Suite"
export MEETNIRA_REPO_ROOT="$PWD"
CFG=tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright.config.ts
```

| Goal | Command |
|------|---------|
| **Single spec file** (both tests in that file, serial) | `npx donobu test --config="$CFG" tasks/Task-1-Risk-Based-Complete-Regression-Suite/tests/core-risk-regression.spec.ts` |
| **One test by title** (substring match) | `npx donobu test --config="$CFG" -g "character customization"` |
| **Other test by title** | `npx donobu test --config="$CFG" -g "learning flow & progress"` |
| **Only `@smoke` group** | `npx donobu test --config="$CFG" -g "@smoke"` |

Headless single test: prefix with `MEETNIRA_HEADLESS=1` (same as full suite).

**Task 2 config, one test** (writes under Task 2’s `reports/`, `playwright-report/`, `test-results/`):

```bash
export MEETNIRA_TASK2_DIR="$PWD/tasks/Task-2-Stability-Run-1-Before-Code-Changes"
export MEETNIRA_REPO_ROOT="$PWD"
npx donobu test --config=tasks/Task-2-Stability-Run-1-Before-Code-Changes/playwright.config.ts -g "character customization"
```

### Task 2 (representative matrix)

The shell script sets `MEETNIRA_TASK2_DIR` and `MEETNIRA_REPO_ROOT` and runs the Task 2 Donobu matrix passes. From repo root:

```bash
bash tasks/Task-2-Stability-Run-1-Before-Code-Changes/run-stability-5x.sh
```

Or use npm: `npm run stability:matrix`.

Task 2 is headed locally by default, so Donobu Studio and visible browser windows should show the agent actions and logs while the matrix runs.

### Task 3 (post-change matrix)

From repo root:

```bash
bash tasks/Task-3-Stability-Run-2-After-Code-Changes/run-stability-matrix.sh
```

Or use npm: `npm run stability:after`.

Task 3 is also headed locally by default, so you can watch the post-change Donobu agent matrix execute in visible browser windows.

### Task 4 (negative matrix)

```bash
MEETNIRA_TASK4_DIR="$PWD/tasks/Task-4-Negative-Path-Matrix" MEETNIRA_REPO_ROOT="$PWD" \
  npx donobu test --config=tasks/Task-4-Negative-Path-Matrix/playwright.config.ts
```

### Regenerate Task 2 email report (no tests)

```bash
node tasks/Task-2-Stability-Run-1-Before-Code-Changes/generate-stability-email-report.mjs
```

(`npm run stability:report` runs this same file.)

Task 3 has its own per-folder markdown generator:

```bash
cd tasks/Task-3-Stability-Run-2-After-Code-Changes
npm run stability:report
```

---

## How to get reports

Artifacts are **gitignored**; they appear after a run under each task folder.

### Task 1 — after `npm test` or `npx donobu test` (Task 1 config)

| Output | Location |
|--------|----------|
| **JSON** (CI-friendly) | `tasks/Task-1-Risk-Based-Complete-Regression-Suite/reports/playwright-report.json` |
| **HTML** (interactive) | `tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright-report/` |
| **Traces / screenshots / video** (failures) | `tasks/Task-1-Risk-Based-Complete-Regression-Suite/test-results/` |

**Open the HTML report** (repo root) — shows the **last** run that wrote to this folder (full suite or a single test):

```bash
npm run report:task-1
```

Equivalent:

```bash
npx playwright show-report tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright-report
```

**After you ran only one test** (see **Task 1 — run one test or one file** above), use the same `show-report` command; the HTML and `reports/playwright-report.json` are **overwritten** by that run.

**Optional:** open on a specific host/port (if the default browser fails to attach):

```bash
npx playwright show-report tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright-report --host 127.0.0.1 --port 9323
```

### Task 2 — after `npm run stability:matrix`

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

Same as Task 1: this HTML reflects the **latest** Donobu run that used the Task 2 config (including a one-off `npx donobu test …` with that config).

Open `STABILITY_EMAIL_REPORT.md` in any editor or paste into email; regenerate with `npm run stability:report` if you already have the five JSON files.

### Task 3 — after `npm run stability:after`

| Output | Location |
|--------|----------|
| JSON per pass | `tasks/Task-3-Stability-Run-2-After-Code-Changes/reports/stability-raw/run-*.json` |
| Latest single-run JSON | `tasks/Task-3-Stability-Run-2-After-Code-Changes/reports/last-run.json` |
| Email-style summary | `tasks/Task-3-Stability-Run-2-After-Code-Changes/reports/STABILITY_EMAIL_REPORT.md` |
| HTML | `tasks/Task-3-Stability-Run-2-After-Code-Changes/playwright-report/` |

Open Task 3 HTML report:

```bash
npm run report:task-3
```

### Task 4 — after `npm run test:task-4`

| Output | Location |
|--------|----------|
| JSON | `tasks/Task-4-Negative-Path-Matrix/reports/playwright-report.json` |
| HTML | `tasks/Task-4-Negative-Path-Matrix/playwright-report/` |
| Traces / screenshots / video | `tasks/Task-4-Negative-Path-Matrix/test-results/` |

Open Task 4 HTML report:

```bash
npm run report:task-4
```

---

## Quick reference

| Goal | Command |
|------|---------|
| Run core tests | `npm test` |
| Run negative-path matrix | `npm run test:task-4` |
| Run without UI | `npm run test:headless` |
| Run **one** Task 1 test (example) | `MEETNIRA_TASK1_DIR="$PWD/tasks/Task-1-Risk-Based-Complete-Regression-Suite" MEETNIRA_REPO_ROOT="$PWD" npx donobu test --config=tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright.config.ts -g "character customization"` |
| Open **last** Task 1 HTML report | `npx playwright show-report tasks/Task-1-Risk-Based-Complete-Regression-Suite/playwright-report` |
| Run Task 2 pre-change matrix | `npm run stability:matrix` |
| Run Task 3 post-change matrix | `npm run stability:after` |
| Refresh summary only | `npm run stability:report` |
| View Task 1 HTML report | `npm run report:task-1` |
| View Task 2 HTML report | `npm run report:task-2` |
| View Task 3 HTML report | `npm run report:task-3` |
| View Task 4 HTML report | `npm run report:task-4` |
| Install Chromium for Playwright | `npx playwright install chromium` |

More maintainer notes: [`AGENTS.md`](AGENTS.md).
