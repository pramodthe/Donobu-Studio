import { expect, type Page } from '@playwright/test';
import { openSelectGradeViaFreePractice } from './meetnira-helpers';

/** Free-practice selectors (production MeetNira). */
export const QUIZ_FLOW_SELECTORS = {
  continueGrade: '[data-testid="button-continue-grade"]',
  firstLearningFriend: '[data-testid="card-character-captain-courage"]',
  startPracticing: '[data-testid="button-continue"]',
  topicCardPrefix: '[data-testid^="card-topic-"]',
  modalPractice: '[data-testid="button-modal-start-practice"]',
  submitAnswer: '[data-testid="button-submit-answer"]',
  firstAnswerChoice: '[data-testid="button-answer-0"]',
  nextQuestion: '[data-testid="button-next-question"]',
} as const;

function gradeCardSelector(grade: number): string {
  return `[data-testid="card-grade-${grade}"]`;
}

export type FreePracticeQuizOptions = {
  grade: number;
  /** e.g. `card-character-wonder-star`. Default: Captain Courage. */
  characterTestId?: string;
};

function characterCardLocator(page: Page, characterTestId?: string) {
  const sel = characterTestId
    ? `[data-testid="${characterTestId}"]`
    : QUIZ_FLOW_SELECTORS.firstLearningFriend;
  return page.locator(sel);
}

export async function runFreePracticeToStudentDashboard(
  page: Page,
  options: FreePracticeQuizOptions,
): Promise<void> {
  const { grade, characterTestId } = options;
  if (grade < 1 || grade > 8) {
    throw new RangeError(`grade must be 1–8, got ${grade}`);
  }

  await openSelectGradeViaFreePractice(page);

  await page.locator(gradeCardSelector(grade)).click();
  await expect(
    page.getByText(`Great choice! You selected Grade ${grade}`).first(),
  ).toBeVisible();

  await page.locator(QUIZ_FLOW_SELECTORS.continueGrade).click();
  await characterCardLocator(page, characterTestId).click();
  await page.locator('html').evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator(QUIZ_FLOW_SELECTORS.startPracticing)).toBeEnabled({
    timeout: 30_000,
  });
  await page.locator(QUIZ_FLOW_SELECTORS.startPracticing).click();

  await page.waitForURL(/\/student(\/|$)/, { timeout: 45_000 });
  await expect(page.getByText('Choose a topic to begin').first()).toBeVisible({
    timeout: 20_000,
  });
}

export async function assertDashboardProgressTrackingVisible(page: Page): Promise<void> {
  await expect(page.getByText(/your progress/i).first()).toBeVisible();
  await expect(
    page.getByRole('button', { name: /operations\s*&\s*algebraic thinking/i }).first(),
  ).toBeVisible();
}

export async function submitOnePracticeMultipleChoiceAnswer(page: Page): Promise<void> {
  await page.locator(QUIZ_FLOW_SELECTORS.firstAnswerChoice).click();
  await expect(page.locator(QUIZ_FLOW_SELECTORS.submitAnswer)).toBeEnabled();
  await page.locator(QUIZ_FLOW_SELECTORS.submitAnswer).click();
  await expect(page.locator(QUIZ_FLOW_SELECTORS.nextQuestion)).toBeVisible({
    timeout: 45_000,
  });
}

export async function goToStudentDashboardFromPractice(page: Page): Promise<void> {
  const next = page.locator(QUIZ_FLOW_SELECTORS.nextQuestion);
  if (await next.isVisible().catch(() => false)) {
    await next.click();
    await expect(page.locator(QUIZ_FLOW_SELECTORS.firstAnswerChoice)).toBeVisible({
      timeout: 20_000,
    });
  }

  const dash = page
    .getByRole('link', { name: /^dashboard$/i })
    .or(page.getByRole('button', { name: /^dashboard$/i }));
  try {
    await dash.first().click({ timeout: 12_000 });
  } catch {
    await page.goto('/student', { waitUntil: 'domcontentloaded' });
  }

  await page.waitForURL((u) => /\/student\/?$/i.test(u.pathname), { timeout: 45_000 });
  await expect(page.getByText('Choose a topic to begin').first()).toBeVisible({
    timeout: 20_000,
  });
}
