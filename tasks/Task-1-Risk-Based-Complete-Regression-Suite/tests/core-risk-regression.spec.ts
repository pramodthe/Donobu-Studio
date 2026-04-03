import { test } from 'donobu';

const AGENT_FLOW_OPTIONS: {
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
  maxToolCalls: 20,
};

/**
 * Task 1 — Risk-based minimum regression using Donobu Page.AI.
 * These tests intentionally route the primary user journey through the Donobu browsing agent
 * so Donobu Studio shows the autonomous tool trace and assertions.
 */
test.describe('@core-risk @regression @donobu-agent critical free-practice flows', () => {
  test.describe.configure({ mode: 'serial' });

  test('character customization: select non-default Learning Friend and reach dashboard', async ({
    page,
  }) => {
    await page.goto('/');

    await page.ai(
      `From the MeetNira home page, click "Try Practice for Free", choose Grade 2,
pick Wonder Star as the learning friend, click the button to start practicing,
and stop when the student dashboard is fully visible.`,
      AGENT_FLOW_OPTIONS,
    );

    await page.ai.assert(
      `Assert the student dashboard is visible, the page includes the text "Your Dashboard",
and a progress section is visible for the free-practice student experience.`,
      { retries: 2, retryDelaySeconds: 2 },
    );
  });

  test('learning flow & progress: topic → practice → back to dashboard', async ({ page }) => {
    await page.goto('/');

    await page.ai(
      `From the MeetNira home page, click "Try Practice for Free", choose Grade 1,
pick Captain Courage, continue until the student dashboard is visible, open the first available topic,
start practice from the modal, complete exactly one question if a direct question is shown,
then return to the dashboard. If the flow lands on a standards picker instead of a direct question,
open one available standard, then return to the dashboard. Stop only when the dashboard is visible again.`,
      {
        ...AGENT_FLOW_OPTIONS,
        maxToolCalls: 28,
      },
    );

    await page.ai.assert(
      `Assert the student dashboard is visible again after completing practice navigation,
and the dashboard still shows a progress section for the student.`,
      { retries: 2, retryDelaySeconds: 2 },
    );
  });
});
