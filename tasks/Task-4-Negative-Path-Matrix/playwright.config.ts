import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig, devices } from 'donobu';

const taskDir =
  process.env.MEETNIRA_TASK4_DIR ??
  path.join(process.cwd(), 'tasks', 'Task-4-Negative-Path-Matrix');
const repoRoot = process.env.MEETNIRA_REPO_ROOT ?? process.cwd();

dotenv.config({ path: path.join(repoRoot, '.env') });

const baseURL = process.env.MEETNIRA_BASE_URL ?? 'https://meetnira.com';
const configuredWorkers = Number(process.env.MEETNIRA_WORKERS);
const workers =
  Number.isFinite(configuredWorkers) && configuredWorkers > 0
    ? configuredWorkers
    : 2;

const headless =
  Boolean(process.env.CI) ||
  process.env.MEETNIRA_HEADLESS === '1' ||
  process.env.MEETNIRA_HEADLESS === 'true';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers,
  timeout: 240_000,
  expect: { timeout: 30_000 },
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
    ['json', { outputFile: path.join(taskDir, 'reports', 'playwright-report.json') }],
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
