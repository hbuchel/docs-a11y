module.exports = {
  runAxe: (pages) => {
    const { exec } = require('child_process');
    const fs = require('fs');
    const xml2js = require('xml2js');
    let output;
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

    pages.forEach((page) => {
      if(urlList.includes(`https://docs.amplify.aws${page}/`)) {
        
        exec(`axe http://localhost:3000${ page }/ --stdout`, {maxBuffer: 3072}, (error, stdout, stderr) => {
          console.log(`Testing http://localhost:3000${ page }/: \n`);
          if(stderr) {
            console.error(stderr);
          } else if (error) {
            console.error(error);
          } else {
            const report = JSON.parse(stdout);
            if (report[0].violations.length > 0) {
              report[0].violations.forEach((violation) => {
                const { description, nodes } = violation;
                console.error("Description: ", description);
                nodes.forEach((node) => {
                  const { failureSummary, html, target } = node;
                  console.log(failureSummary);
                  console.log("HTML: \n\t", html);
                  target.forEach((selector) => {
                    console.log("Found at: \n\t", selector);
                  });
                });
              });
            }
          }
        });
      }
    })
  }
};
