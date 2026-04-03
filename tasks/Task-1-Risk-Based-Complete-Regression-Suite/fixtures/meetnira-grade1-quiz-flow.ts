import { expect } from '@playwright/test';
import type { DonobuExtendedPage } from 'donobu';
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

export const UPPER_GRADE_CHARACTER_TEST_IDS = [
  'card-character-nova',
  'card-character-cipher',
  'card-character-echo',
  'card-character-blaze',
  'card-character-sage',
  'card-character-volt',
] as const;

function gradeCardSelector(grade: number): string {
  return `[data-testid="card-grade-${grade}"]`;
}

export type FreePracticeQuizOptions = {
  grade: number;
  /** e.g. `card-character-wonder-star` or `card-character-nova`. */
  characterTestId?: string;
};

function characterCardLocator(page: DonobuExtendedPage, characterTestId?: string) {
  return page.locator(`[data-testid="${characterTestId}"]`);
}

function defaultCharacterTestId(grade: number): string {
  return grade >= 6 ? 'card-character-nova' : 'card-character-captain-courage';
}

export async function assertDashboardLoaded(page: DonobuExtendedPage): Promise<void> {
  await expect(page.getByText('Choose a topic to begin').first()).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.locator(QUIZ_FLOW_SELECTORS.topicCardPrefix).first()).toBeVisible({
    timeout: 20_000,
  });
}

export async function openFirstTopicPractice(
  page: DonobuExtendedPage,
): Promise<'question-flow' | 'standards-picker'> {
  const firstTopic = page.locator(QUIZ_FLOW_SELECTORS.topicCardPrefix).first();
  await expect(firstTopic).toBeVisible({ timeout: 15_000 });
  await firstTopic.click();

  await expect(page.locator(QUIZ_FLOW_SELECTORS.modalPractice)).toBeVisible({
    timeout: 15_000,
  });
  await page.locator(QUIZ_FLOW_SELECTORS.modalPractice).click();

  await page.waitForURL(/\/student\/practice/, { timeout: 45_000 });

  if (await page.locator(QUIZ_FLOW_SELECTORS.submitAnswer).isVisible().catch(() => false)) {
    return 'question-flow';
  }

  await expect(page.getByText(/Pick Your Practice Topic/i).first()).toBeVisible({
    timeout: 15_000,
  });
  return 'standards-picker';
}

export async function assertQuestionFlowVisible(page: DonobuExtendedPage): Promise<void> {
  await expect(page.locator(QUIZ_FLOW_SELECTORS.submitAnswer)).toBeVisible({
    timeout: 30_000,
  });
}

export async function assertStandardsPickerVisible(page: DonobuExtendedPage): Promise<void> {
  await expect(page.getByText(/Pick Your Practice Topic/i).first()).toBeVisible({
    timeout: 15_000,
  });
  await expect(page).toHaveURL(/\/student\/practice/i);
}

export async function runFreePracticeToStudentDashboard(
  page: DonobuExtendedPage,
  options: FreePracticeQuizOptions,
): Promise<void> {
  const { grade, characterTestId } = options;
  if (grade < 1 || grade > 8) {
    throw new RangeError(`grade must be 1–8, got ${grade}`);
  }
  const effectiveCharacterTestId = characterTestId ?? defaultCharacterTestId(grade);

  await page.runAccessibilityTest().catch(() => undefined);

  await openSelectGradeViaFreePractice(page);

  await page.locator(gradeCardSelector(grade)).click();
  await expect(
    page.getByText(`Great choice! You selected Grade ${grade}`).first(),
  ).toBeVisible();

  await page.locator(QUIZ_FLOW_SELECTORS.continueGrade).click();
  await characterCardLocator(page, effectiveCharacterTestId).click();
  await page.locator('html').evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator(QUIZ_FLOW_SELECTORS.startPracticing)).toBeEnabled({
    timeout: 30_000,
  });
  await page.locator(QUIZ_FLOW_SELECTORS.startPracticing).click();

  await page.waitForURL(/\/student(\/|$)/, { timeout: 45_000 });
  await assertDashboardLoaded(page);
}

export async function assertDashboardProgressTrackingVisible(
  page: DonobuExtendedPage,
): Promise<void> {
  await expect(page.getByText(/your progress/i).first()).toBeVisible();
  await expect(page.locator(QUIZ_FLOW_SELECTORS.topicCardPrefix).first()).toBeVisible({
    timeout: 20_000,
  });
}

export async function submitOnePracticeMultipleChoiceAnswer(
  page: DonobuExtendedPage,
): Promise<void> {
  await page.locator(QUIZ_FLOW_SELECTORS.firstAnswerChoice).click();
  await expect(page.locator(QUIZ_FLOW_SELECTORS.submitAnswer)).toBeEnabled();
  await page.locator(QUIZ_FLOW_SELECTORS.submitAnswer).click();
  await expect(page.locator(QUIZ_FLOW_SELECTORS.nextQuestion)).toBeVisible({
    timeout: 45_000,
  });
}

export async function goToStudentDashboardFromPractice(
  page: DonobuExtendedPage,
): Promise<void> {
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
  await assertDashboardLoaded(page);
}
