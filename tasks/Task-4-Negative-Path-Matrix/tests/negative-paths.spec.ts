import { test } from 'donobu';

const NEGATIVE_AGENT_OPTIONS: {
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
  ],
  maxToolCalls: 14,
};

const NEGATIVE_MATRIX = [
  {
    name: 'grade gate: continue stays unavailable before grade selection',
    instruction: `From the MeetNira home page, click "Try Practice for Free" and stop on the grade selection page without choosing any grade.`,
    assertion: `Assert the grade selection page is visible and the Continue button cannot be used before a grade is selected.`,
  },
  {
    name: 'character gate: start practicing stays unavailable before partner selection',
    instruction: `From the MeetNira home page, click "Try Practice for Free", choose Grade 1,
continue to the learning friend page, and stop without choosing any learning friend.`,
    assertion: `Assert the learning friend selection page is visible and the Start Practicing button cannot be used before a learning friend is chosen.`,
  },
  {
    name: 'guest state: free-practice dashboard still prompts account creation',
    instruction: `From the MeetNira home page, click "Try Practice for Free", choose Grade 2,
pick Wonder Star, and continue until the student dashboard is visible.`,
    assertion: `Assert the dashboard still shows a guest or sign-up prompt, meaning the user is not treated as a logged-in student account.`,
  },
  {
    name: 'dashboard precondition: no start-practice modal appears before a topic is opened',
    instruction: `From the MeetNira home page, click "Try Practice for Free", choose Grade 6,
pick Cipher, and continue until the student dashboard is visible. Stop there without opening any topic.`,
    assertion: `Assert the dashboard is visible and there is no topic practice-start modal open yet.`,
  },
] as const;

test.describe('@task-4 @negative @matrix @donobu-agent negative-path coverage', () => {
  for (const scenario of NEGATIVE_MATRIX) {
    test(scenario.name, async ({ page }) => {
      await page.goto('/');
      await page.ai(scenario.instruction, NEGATIVE_AGENT_OPTIONS);
      await page.ai.assert(scenario.assertion, {
        retries: 2,
        retryDelaySeconds: 2,
      });
    });
  }
});
