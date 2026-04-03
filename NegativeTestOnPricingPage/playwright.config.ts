import { defineConfig, devices } from 'donobu';

export default defineConfig({
  testDir: './tests',
  projects: [
    {
      name: 'NagativeTestOnPricingFlow',
      testMatch: 'tests/NagativeTestOnPricingFlow.spec.ts',
      use: { ...devices['Desktop Chromium'] },
      timeout: 830000,
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
