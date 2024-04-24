module.exports = {
  runAxe: (pages) => {
    const { AxePuppeteer } = require('@axe-core/puppeteer');
    const puppeteer = require('puppeteer');

   
    const fs = require('fs');
    const xml2js = require('xml2js');
    
    var parser = new xml2js.Parser();

    const urlList = [];
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

    const existingPages = pages.filter((urlList.includes(`https://docs.amplify.aws${page}/`)));

    async function runAxeAnalyze(page) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`http://localhost:3000${ page }/`);
      try {
        const results = await new AxePuppeteer(page).analyze();
        console.log(results);
      } catch (e) {
        // do something with the error
      }
    
      await browser.close();
    }

    existingPages.forEach((page) => {
      console.log('page: ', `http://localhost:3000${ page }/`);
      runAxeAnalyze(page);
    })
  }
};
