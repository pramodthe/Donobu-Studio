import type { Page } from '@playwright/test';

/** Opens Nira / MeetNira home; resilient to redirects. */
export async function openMeetNiraHome(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}

/**
 * Use **Try Practice for Free** only — do not automate Student/Mentor Login (OAuth).
 */
export async function openSelectGradeViaFreePractice(page: Page): Promise<void> {
  await openMeetNiraHome(page);
  const primary = page.locator('[data-testid="button-try-practice"]');
  if ((await primary.count()) > 0) {
    await primary.click();
  } else {
    await page.getByRole('button', { name: /try practice for free/i }).click();
  }
  await page.waitForURL(/\/student\/select-grade/i, { timeout: 30_000 });
}
