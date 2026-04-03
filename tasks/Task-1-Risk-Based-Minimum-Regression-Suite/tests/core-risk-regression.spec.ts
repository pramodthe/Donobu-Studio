import { expect, test } from 'donobu';
import {
  assertDashboardProgressTrackingVisible,
  goToStudentDashboardFromPractice,
  QUIZ_FLOW_SELECTORS,
  runFreePracticeToStudentDashboard,
  submitOnePracticeMultipleChoiceAnswer,
} from '../fixtures/meetnira-grade1-quiz-flow';

/**
 * Task 1 — Risk-based minimum regression (Donobu + Playwright).
 * Record or refine flows in Donobu Studio, then align selectors here.
 */
test.describe('@core-risk @regression critical — core scenarios (deterministic)', () => {
  test.describe('@smoke', () => {
    test('character customization: select non-default Learning Friend and reach dashboard', async ({
      page,
    }) => {
      await runFreePracticeToStudentDashboard(page, {
        grade: 2,
        characterTestId: 'card-character-wonder-star',
      });
      await assertDashboardProgressTrackingVisible(page);
      await expect(page.getByText('Your Dashboard').first()).toBeVisible();
    });
  });

  test('learning flow & progress: grade → topic → submit answer → dashboard progress still visible', async ({
    page,
  }) => {
    await runFreePracticeToStudentDashboard(page, { grade: 1 });
    await assertDashboardProgressTrackingVisible(page);

    const firstTopic = page.locator(QUIZ_FLOW_SELECTORS.topicCardPrefix).first();
    await expect(firstTopic).toBeVisible({ timeout: 15_000 });
    await firstTopic.click();

    await expect(page.locator(QUIZ_FLOW_SELECTORS.modalPractice)).toBeVisible({
      timeout: 15_000,
    });
    await page.locator(QUIZ_FLOW_SELECTORS.modalPractice).click();

    await page.waitForURL(/\/student\/practice/, { timeout: 45_000 });
    await expect(page.locator(QUIZ_FLOW_SELECTORS.submitAnswer)).toBeVisible({
      timeout: 30_000,
    });

    await submitOnePracticeMultipleChoiceAnswer(page);

    await goToStudentDashboardFromPractice(page);
    await assertDashboardProgressTrackingVisible(page);
  });
});
