module.exports = {
  runAxe: (pages) => {
    const { exec } = require('child_process');
    const fs = require('fs');
    const xml2js = require('xml2js');

    var parser = new xml2js.Parser();

    const urlList = [];

    fs.readFile('public/sitemap.xml', function(err, data) {
      parser.parseString(data, function(err, result) {
        const urls = result.urlset.url;
        urls.forEach(url => {
          urlList.push(url.loc[0]);
        });
      })
    })

    pages.forEach((page) => {
      console.log('page: ', page);
      if(urlList.includes(`https://docs.amplify.aws${page}`)) {
        exec(`axe http://localhost:3000${ page } --exit | jq ".[0].violations"`, (error, stdout, stderr) => {
        console.log("STDOUT:", stdout, ", STDERR:", stderr);
      });
      }
      
    })
  }
};
