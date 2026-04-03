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
        'Navigate to the webpage above and click \'Pricing\'. Assert "Continue with Monthly" button is enabled.\n Assert "Logout" icon is displayed\nclick "Setting" icon. Assert it should go to setting page.\n\n\n',
    },
  ],
};
test('NagativeTestOnPricingFlow', testDetails, async ({ page }) => {
  // Initializing web navigation.
  await page.goto('https://meetnira.com');

  // Clicking the 'Pricing' button as per the objective.
  await page
    .find("[data-testid='button-pricing']", {
      failover: [
        ".//button[normalize-space(.)='Pricing']",
        'a > button.inline-flex',
      ],
    })
    .click('left');

  // Scrolling down to find the 'Continue with Monthly' button.
  await page.find('html').scroll('DOWN');

  // Asserting that the 'Continue with Monthly' button is enabled as required by the objective.
  await page.ai.assert("The 'Continue with Monthly' button is enabled.");

  // Scrolling up to the top of the page to find the Logout icon and Setting icon.
  await page.find('html').scroll('UP', { maxScroll: true });

  // Asserting that the 'Logout' icon is displayed as required by the objective.
  await page.ai.assert("The 'Logout' icon/button is displayed.");

  // Clicking the 'Setting' icon (represented by the gear icon) to navigate to the settings page.
  await page
    .find("[data-testid='button-account']", {
      failover: [
        "[href='/account']",
        'header.border-b > div > div:nth-of-type(2) > a:nth-of-type(4)',
      ],
    })
    .click('left');

  // Navigating back to the Pricing page to find the 'Setting' icon and complete the objective.
  await page
    .find("[data-testid='button-pricing']", {
      failover: [
        ".//button[normalize-space(.)='Pricing']",
        'a > button.inline-flex',
      ],
    })
    .click('left');

  // Clicking the 'Setting' icon (gear icon) to navigate to the settings page as required by the objective.
  await page
    .find("[data-testid='button-account']", {
      failover: [
        "[href='/account']",
        'header.border-b > div > div:nth-of-type(2) > a:nth-of-type(4)',
      ],
    })
    .click('left');

  // Clicking login to see if it redirects to the setting/account page.
  await page
    .find("[data-testid='button-login']", {
      failover: [".//button[normalize-space(.)='Login']", 'button.inline-flex'],
    })
    .click('left');
});
