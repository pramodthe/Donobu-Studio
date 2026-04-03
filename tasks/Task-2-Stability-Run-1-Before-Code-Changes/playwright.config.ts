import path from 'node:path';
import dotenv from 'dotenv';
import os from 'node:os';
import { defineConfig, devices } from 'donobu';

const taskDir =
  process.env.MEETNIRA_TASK2_DIR ??
  path.join(process.cwd(), 'tasks', 'Task-2-Stability-Run-1-Before-Code-Changes');
const repoRoot = process.env.MEETNIRA_REPO_ROOT ?? process.cwd();

dotenv.config({ path: path.join(repoRoot, '.env') });

const baseURL = process.env.MEETNIRA_BASE_URL ?? 'https://meetnira.com';

const parallelWorkers = Math.min(
  8,
  Math.max(2, typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length),
);

const headless =
  Boolean(process.env.CI) ||
  process.env.MEETNIRA_HEADLESS === '1' ||
  process.env.MEETNIRA_HEADLESS === 'true';

/** Same tests as Task 1 — full regression slice for five-run stability. Chromium-only; artifacts under Task 2 folder. */
export default defineConfig({
  testDir: path.join(repoRoot, 'tasks', 'Task-1-Risk-Based-Minimum-Regression-Suite', 'tests'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : parallelWorkers,
  timeout: 180_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    headless,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30_000,
    navigationTimeout: 45_000,
  },
  reporter: [
    ['list', { printSteps: true }],
    ['json', { outputFile: path.join(taskDir, 'reports', 'last-run.json') }],
    ['html', { outputFolder: path.join(taskDir, 'playwright-report'), open: 'never' }],
  ],
  outputDir: path.join(taskDir, 'test-results'),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], headless },
    },
  ],
});
