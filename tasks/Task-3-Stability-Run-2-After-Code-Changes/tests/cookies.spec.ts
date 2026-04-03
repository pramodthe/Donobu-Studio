import { expect } from '@playwright/test';
import { test } from 'donobu';
import { runFreePracticeToStudentDashboard } from '../../Task-1-Risk-Based-Complete-Regression-Suite/fixtures/meetnira-grade1-quiz-flow';

test.describe('@task-3 @cookies @browser-state browser cookie and storage coverage', () => {
  test('privacy page discloses usage and preference data handling', async ({ page }) => {
    await page.goto('/privacy');

    await expect(page.getByText(/Usage Data:/i).first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(/Preferences:/i).first()).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByText(/Selected character companion and display settings/i).first(),
    ).toBeVisible({ timeout: 30_000 });
  });

  test('anonymous free-practice flow writes browser state and captures a cookie report', async ({
    page,
  }) => {
    await page.goto('/');

    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('nira_anonymous_session')))
      .toBeNull();

    await runFreePracticeToStudentDashboard(page, {
      grade: 1,
      characterTestId: 'card-character-captain-courage',
    });

    await page.ai.createCookieReport();

    const anonymousSession = await page.evaluate(() => {
      const raw = localStorage.getItem('nira_anonymous_session');
      return raw ? JSON.parse(raw) : null;
    });
    expect(anonymousSession).not.toBeNull();
    expect(anonymousSession.selectedGrade).not.toBeNull();
    expect(anonymousSession.selectedCharacter).not.toBeNull();
    expect(Array.isArray(anonymousSession.practiceAttempts)).toBe(true);
    expect(typeof anonymousSession.createdAt).toBe('number');

    const parentViewSession = await page.evaluate(() => ({
      viewingAsStudentId: sessionStorage.getItem('viewingAsStudentId'),
      viewingAsStudentName: sessionStorage.getItem('viewingAsStudentName'),
    }));
    expect(parentViewSession).toEqual({
      viewingAsStudentId: null,
      viewingAsStudentName: null,
    });
  });
});
