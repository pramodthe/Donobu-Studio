/**
 * Note that this test uses tools that require the usage of an LLM, so be
 * sure to have an appropriate LLM API key available. This can be done
 * by providing an environment variable (e.g. OPENAI_API_KEY, ANTHROPIC_API_KEY,
 * or GOOGLE_GENERATIVE_AI_API_KEY) when running the test...
 *
 *    Example: `OPENAI_API_KEY=YOUR_KEY npx playwright test`
 *
 * ...or by configuring a flow runner using the Donobu app.
 */
import { test } from 'donobu';

const testDetails = {
  annotation: [
    {
      type: 'objective',
      description:
        "Navigate to the webpage above and click 'try Pracitce for free'. \nClick on grade 1 tile and Assert \"Great choice! You selected Grade 1\".\nCheck the browser cookies this website is using.\nClick 'Continue' and select first Tile and assert \"Start Practicing!\" button is enabled. Click 'Start Practicing!' button. \n\n",
    },
  ],
};
test('BrowserCookieTestGrade1completeflow', testDetails, async ({ page }) => {
  // Initializing web navigation.
  await page.goto('https://meetnira.com');

  // Scrolling down to find the 'try Practice for free' button as it is not visible in the current viewport.
  await page.find('html').scroll('DOWN');

  // Clicking 'Try Practice for Free' to proceed with the objective.
  await page
    .find("[data-testid='button-try-practice']", {
      failover: [
        ".//button[normalize-space(.)='Try Practice for Free']",
        'div.shadcn-card > div:nth-of-type(2) > button:nth-of-type(2)',
      ],
    })
    .click('left');

  // Clicking on the Grade 1 tile as per the objective.
  await page
    .find("[data-testid='card-grade-1']", {
      failover: [
        "(.//div[normalize-space(.)='1Grade 1Counting & Basic Addition'])[1]",
        'div.grid > div:nth-of-type(1)',
      ],
    })
    .click('left');

  // Asserting that the selection of Grade 1 was successful as per the objective.
  await page.ai.assert(
    "The text 'Great choice! You selected Grade 1' is visible on the page.",
  );

  // Checking the browser cookies used by the website as per the objective.
  await page.ai.createCookieReport();

  // Clicking 'Continue' to move to the next step of the flow.
  await page
    .find("[data-testid='button-continue-grade']", {
      failover: [
        ".//button[normalize-space(.)='Continue']",
        'button.inline-flex',
      ],
    })
    .click('left');

  // Selecting the first tile (Captain Courage) as per the objective.
  await page
    .find("[data-testid='card-character-captain-courage']", {
      failover: [
        "(.//div[normalize-space(.)='Captain CourageA brave superhero who loves solving problems!'])[1]",
        'div.grid > div:nth-of-type(1)',
      ],
    })
    .click('left');

  // Scrolling down to find the 'Start Practicing!' button as it is not currently visible in the viewport.
  await page.find('html').scroll('DOWN');

  // Asserting that the 'Start Practicing!' button is enabled before clicking it, as per the objective.
  await page.ai.assert("The 'Start Practicing!' button is enabled.");

  // Clicking the 'Start Practicing!' button to complete the final step of the objective.
  await page
    .find("[data-testid='button-continue']", {
      failover: [
        ".//button[normalize-space(.)='Start Practicing!']",
        'button.inline-flex',
      ],
    })
    .click('left');
});
