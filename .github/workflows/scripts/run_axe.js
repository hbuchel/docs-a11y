module.exports = {
  runAxe: (pages) => {
    const { exec } = require('child_process');
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
    

    console.log('urlList: ', urlList);

    pages.forEach((page) => {
      console.log('page: ', `https://docs.amplify.aws${page}`, ' is in siteMap?: ', urlList.includes(`https://docs.amplify.aws${page}`));
      if(urlList.includes(`https://docs.amplify.aws${page}`)) {
        console.log(`Testing ${page}: \n`);
        exec(`axe http://localhost:3000${ page } --exit | jq ".[0].violations"`, (error, stdout, stderr) => {
        console.log("STDOUT:", stdout, ", STDERR:", stderr);
      });
      }
      
    })
  }
};
