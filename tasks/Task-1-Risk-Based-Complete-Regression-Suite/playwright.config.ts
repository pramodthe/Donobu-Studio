import path from 'node:path';
import dotenv from 'dotenv';
import os from 'node:os';
import { defineConfig, devices } from 'donobu';

const taskRoot =
  process.env.MEETNIRA_TASK1_DIR ??
  path.join(process.cwd(), 'tasks', 'Task-1-Risk-Based-Complete-Regression-Suite');
const repoRoot =
  process.env.MEETNIRA_REPO_ROOT ?? path.resolve(taskRoot, '..', '..');
dotenv.config({ path: path.join(repoRoot, '.env') });

const parallelWorkers = Math.min(
  8,
  Math.max(2, typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length),
);

const baseURL = process.env.MEETNIRA_BASE_URL ?? 'https://meetnira.com';
const isProductionTarget = /^https:\/\/meetnira\.com\/?$/i.test(baseURL);
const configuredWorkers = Number(process.env.MEETNIRA_WORKERS);
const workers =
  Number.isFinite(configuredWorkers) && configuredWorkers > 0
    ? configuredWorkers
    : process.env.CI
      ? 4
      : isProductionTarget
        ? 1
        : parallelWorkers;

/** Visible browser windows locally; headless in CI or when MEETNIRA_HEADLESS=1 */
const headless =
  Boolean(process.env.CI) ||
  process.env.MEETNIRA_HEADLESS === '1' ||
  process.env.MEETNIRA_HEADLESS === 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers,
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
    ['json', { outputFile: path.join(taskRoot, 'reports', 'playwright-report.json') }],
    ['html', { outputFolder: path.join(taskRoot, 'playwright-report'), open: 'never' }],
  ],
  outputDir: path.join(taskRoot, 'test-results'),
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], headless },
    },
  ],
});
