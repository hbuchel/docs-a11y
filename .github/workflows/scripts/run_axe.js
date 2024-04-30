module.exports = {
  runAxe: (pages) => {
    const { AxePuppeteer } = require('@axe-core/puppeteer');
    const puppeteer = require('puppeteer');
    const fs = require('fs');
    const xml2js = require('xml2js');
    
    var parser = new xml2js.Parser();

    const urlList = [];
    const violations = [];
    const siteMap = fs.readFileSync('public/sitemap.xml');
    
    parser.parseString(siteMap, function(err, result) {
      if(err) {
        console.log(`Error parsing sitemap: ${err}`);
      } else {
        const urls = result.urlset.url;
        urls.forEach((url) => {
          urlList.push(url.loc[0]);
        });
      }
    })

    const existingPages = pages.filter((page) => urlList.includes(`https://docs.amplify.aws${page}/`));

    async function runAxeAnalyze(pages) {
      console.log(`running axe on ${pages}`);
      for (const page of pages) {
        console.log(`testing page ${page}`);
        const browser = await puppeteer.launch();
        const pageToVisit = await browser.newPage();
        await pageToVisit.goto(`http://localhost:3000${page}/`);
        try {
          const results = await new AxePuppeteer(pageToVisit).analyze();
          if(results.violations) {
            results.violations.forEach(violation => {
              console.log(violation);
              violations.push(violation);
            })
          }
          console.log(results.violations);
        } catch (e) {
          // do something with the error
        }
        await browser.close();
      }

      return violations;
    }

    runAxeAnalyze(existingPages);
  }
};
