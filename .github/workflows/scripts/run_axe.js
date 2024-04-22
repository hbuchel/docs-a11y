module.exports = {
  runAxe: (pages) => {
    const { exec } = require('child_process');
    const fs = require('fs');
    const xml2js = require('xml2js');

    var parser = new xml2js.Parser();

    const urlList = [];

    fs.readFileSync('public/sitemap.xml', function(err, data) {
      parser.parseString(data, function(err, result) {
        if(err) {
          console.log(err);
        }
        console.log('result: ', result);
        const urls = result.urlset.url;
        console.log('urls: ', urls);
        urls.forEach((url) => {
          console.log(url.loc[0]);
          urlList.push(url.loc[0]);
        });
        
      })
    });

    console.log('urlList: ', urlList);

    pages.forEach((page) => {
      console.log('page: ', page);
      if(urlList.includes(`https://docs.amplify.aws${page}`)) {
        console.log(`Testing ${page}: \n`);
        exec(`axe http://localhost:3000${ page } --exit | jq ".[0].violations"`, (error, stdout, stderr) => {
        console.log("STDOUT:", stdout, ", STDERR:", stderr);
      });
      }
      
    })
  }
};
