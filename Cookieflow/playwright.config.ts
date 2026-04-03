import { defineConfig, devices } from 'donobu';

export default defineConfig({
  testDir: './tests',
  projects: [
    {
      name: 'BrowserCookieTestGrade1completeflow',
      testMatch: 'tests/BrowserCookieTestGrade1completeflow.spec.ts',
      use: { ...devices['Desktop Chromium'] },
      timeout: 420000,
    },
  ],
  use: {
    screenshot: 'on',
    video: 'on',
  },
  reporter: [
    ['json', { outputFile: 'test-results/playwright-report.json' }],
    ['donobu/reporter/html'],
  ],
  metadata: {
    selfHealingOptions: {
      areElementIdsVolatile: false,
      disableSelectorFailover: false,
    },
  },
});
