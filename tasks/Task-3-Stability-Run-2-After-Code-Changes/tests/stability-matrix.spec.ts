import { test } from 'donobu';

const MATRIX_AGENT_OPTIONS: {
  allowedTools: string[];
  maxToolCalls: number;
} = {
  allowedTools: [
    'goToWebpage',
    'click',
    'hoverOverElement',
    'scrollPage',
    'wait',
    'pressKey',
    'chooseSelectOption',
  ],
  maxToolCalls: 18,
};

const STABILITY_MATRIX = [
  {
    name: 'lower-grade onboarding: grade 2 + Wonder Star reaches dashboard progress',
    instruction: `From the MeetNira home page, click "Try Practice for Free", choose Grade 2,
pick Wonder Star as the learning friend, and continue until the student dashboard is visible.`,
    assertion: `Assert the student dashboard is visible, the page contains "Your Dashboard",
and a progress section is visible.`,
  },
  {
    name: 'lower-grade topic selection: grade 1 + Sparkle opens the start-practice modal',
    instruction: `From the MeetNira home page, click "Try Practice for Free", choose Grade 1,
pick Sparkle as the learning friend, continue to the student dashboard,
open the first available topic, and stop when the start-practice modal is visible.`,
    assertion: `Assert the first topic's practice-start modal is visible and the page is still within the student free-practice flow.`,
  },
  {
    name: 'upper-grade onboarding: grade 6 + Cipher reaches the middle-school dashboard',
    instruction: `From the MeetNira home page, click "Try Practice for Free", choose Grade 6,
pick Cipher as the study partner, and continue until the student dashboard is visible.`,
    assertion: `Assert the middle-school student dashboard is visible and at least one topic card is shown.`,
  },
  {
    name: 'upper-grade practice hub: grade 8 + Nova opens standards picker',
    instruction: `From the MeetNira home page, click "Try Practice for Free", choose Grade 8,
pick Nova as the study partner, continue to the student dashboard, open the first available topic,
start practice from the modal, and stop when the practice standards picker is visible.`,
    assertion: `Assert the standards-picker practice view is visible for the Grade 8 free-practice flow.`,
  },
] as const;

test.describe('@task-3 @stability @matrix @donobu-agent representative free-practice coverage after code changes', () => {
  for (const scenario of STABILITY_MATRIX) {
    test(scenario.name, async ({ page }) => {
      await page.goto('/');
      await page.ai(scenario.instruction, MATRIX_AGENT_OPTIONS);
      await page.ai.assert(scenario.assertion, {
        retries: 2,
        retryDelaySeconds: 2,
      });
    });
  }
});
