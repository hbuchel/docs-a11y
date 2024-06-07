module.exports = {
  getChangedPages: async ({ github, context, buildDir }) => {
    const { getSiteMapUrls } = require('./utilities.js');

    const {
      issue: { number: issue_number },
      repo: { owner, repo }
    } = context;

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
      'vue'
    ];

    const changedFiles = await github.paginate(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      { owner, repo, pull_number: issue_number },
      (response) =>
        response.data.filter(
          (file) => file.status === 'modified' || file.status === 'added'
        )
    );

    // Get only the changed files that are pages and build out the
    // possiblePages array
    changedFiles.forEach(({ filename }) => {
      const isPage =
        filename.startsWith('src/pages') &&
        (filename.endsWith('index.mdx') || filename.endsWith('index.tsx'));
      if (isPage) {
        const path = filename
          .replace('src/pages', '')
          .replace('/index.mdx', '')
          .replace('/index.tsx', '');
        if (path.includes('[platform]')) {
          platforms.forEach((platform) => {
            possiblePages.push(path.replace('[platform]', platform));
          });
        } else {
          possiblePages.push(path);
        }
      }
    });

    const urlList = await getSiteMapUrls(buildDir);

    // Filter the possiblePages for only those that are part of the sitemap
    const pages = possiblePages.filter((page) =>
      urlList.includes(`https://docs.amplify.aws${page}/`)
    );

    return pages;
  }
};
