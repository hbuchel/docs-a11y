// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AxePuppeteer } = require('@axe-core/puppeteer');

describe('home page', () => {
  beforeAll(async () => {
    await page.goto(`http://localhost:3000/`);
    await page.waitForSelector('h1');
  });

  it('should display the home page with no accessibility violations', async () => {
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations).toHaveLength(0);
  });

  it('should display the home page with no accessibility violations in dark mode', async () => {
    await page.click('button[title="Dark mode"]');
    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
