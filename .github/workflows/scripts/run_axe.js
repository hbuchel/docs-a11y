module.exports = {
  runAxe: (pages) => {
    const core = require('@actions/core');
    const { AxePuppeteer } = require('@axe-core/puppeteer');
    const puppeteer = require('puppeteer');
    
    const violations = [];
    
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    async function runAxeAnalyze(pages) {
      for (const page of pages) {
        console.log(`testing page http://localhost:3000${page}/`);
        const browser = await puppeteer.launch();
        const pageToVisit = await browser.newPage();
        await pageToVisit.goto(`http://localhost:3000${page}/`, {waitUntil: 'domcontentloaded'});
        await pageToVisit.click('button[title="Light mode"]');
        await pageToVisit.waitForSelector('[data-amplify-color-mode="light"]');
        await sleep(300);

        
        try {
          console.log('\nTesting light mode: \n')
          const results = await new AxePuppeteer(pageToVisit).analyze();
          if(results.violations) {
            results.violations.forEach(violation => {
              console.log(violation);
              violations.push(violation);
            })
          } else {
            console.log('No violations found.');
          }
          
        } catch (e) {
          // do something with the error
        }

        await pageToVisit.click('button[title="Dark mode"]');
        await pageToVisit.waitForSelector('[data-amplify-color-mode="dark"]');
        await sleep(300);
        
        try {
          console.log('\nTesting dark mode: \n')
          const results = await new AxePuppeteer(pageToVisit).analyze();
          if(results.violations) {
            results.violations.forEach(violation => {
              console.log(violation);
              violations.push(violation);
            })
          } else {
            console.log('No violations found.');
          }
          
        } catch (e) {
          // do something with the error
        }

        await browser.close();
      }
      if(violations.length > 0) {
        core.setFailed(`Please fix the above accessibility violations.`);
      }
    }

    runAxeAnalyze(pages);
  }
};
