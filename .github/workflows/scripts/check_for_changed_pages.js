module.exports = {
  getChangedPages: ({ github, context, core }) => {
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
        const pages = [];
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
          // src/pages/[platform]/how-amplify-works/index.mdx
    
          const isMDXPage = filename.startsWith('src/pages') && filename.endsWith('index.mdx');
          if(isMDXPage) {

            const path = filename.replace('src/pages', '').replace('/index.mdx', '');
            platforms.forEach((platform) => {
              pages.push(path.replace('[platform]', platform));
            })
          }
        })
        console.log('Changed pages: ', JSON.stringify(pages));

        // Return the new files count to be used in the github workflow
        return pages;
      });
  },
}
