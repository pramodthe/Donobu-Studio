import path from 'node:path';
import dotenv from 'dotenv';
import { defineConfig, devices } from 'donobu';

const taskDir =
  process.env.MEETNIRA_TASK2_DIR ??
  path.join(process.cwd(), 'tasks', 'Task-2-Stability-Run-1-Before-Code-Changes');
const repoRoot = process.env.MEETNIRA_REPO_ROOT ?? process.cwd();

dotenv.config({ path: path.join(repoRoot, '.env') });

const baseURL = process.env.MEETNIRA_BASE_URL ?? 'https://meetnira.com';
const deviceMode = (process.env.MEETNIRA_DEVICE ?? 'desktop').toLowerCase();
const isMobile = deviceMode === 'mobile';
const projectName = isMobile ? 'mobile-chromium' : 'chromium';
const devicePreset = isMobile ? devices['iPhone 13'] : devices['Desktop Chrome'];
const configuredWorkers = Number(process.env.MEETNIRA_WORKERS);
const workers =
  Number.isFinite(configuredWorkers) && configuredWorkers > 0
    ? configuredWorkers
    : 2;

const headless =
  Boolean(process.env.CI) ||
  process.env.MEETNIRA_HEADLESS === '1' ||
  process.env.MEETNIRA_HEADLESS === 'true';

/** Representative Task 2 matrix with visible local Chromium workers by default. */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
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
    ['json', { outputFile: path.join(taskDir, 'reports', 'last-run.json') }],
    ['html', { outputFolder: path.join(taskDir, 'playwright-report'), open: 'never' }],
  ],
  outputDir: path.join(taskDir, 'test-results'),
  projects: [
    {
      name: projectName,
      use: { ...devicePreset, headless },
    },
  ],
});
