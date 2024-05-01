module.exports = {
  getChangedPages: ({ github, context }) => {
    const fs = require('fs');
    const xml2js = require('xml2js');
    
    const parser = new xml2js.Parser();

    const urlList = [];
    
    
    const {
      issue: { number: issue_number },
      repo: { owner, repo }
    } = context;

    // Use the Github API to query for the list of files from the PR
    return github
      .paginate(
        'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
        { owner, repo, pull_number: issue_number },
        (response) => response.data.filter((file) => (file.status === 'modified' || file.status === 'added'))
      )
      .then((files) => {
        const possiblePages = [];
        const platforms = [
          'android',
          'angular',
          'flutter',
          'javascript',
          'nextjs',
          'react',
          'react-native',
          'swift',
          'vue',
        ]
        files.forEach(({filename}) => {
          const isPage = filename.startsWith('src/pages') && (filename.endsWith('index.mdx') || filename.endsWith('index.tsx'));
          if(isPage) {

            const path = filename.replace('src/pages', '').replace('/index.mdx', '').replace('/index.tsx', '');
            if(path.includes('[platform]')) {
              platforms.forEach((platform) => {
                possiblePages.push(path.replace('[platform]', platform));
              })
            } else {
              possiblePages.push(path);
            }
          }
        })

        

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

        const pages = possiblePages.filter((page) => urlList.includes(`https://docs.amplify.aws${page}/`));
        
        return pages;
      });
  },
}
