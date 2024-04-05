module.exports = {
  getChangedFiles: ({ github, context, core }) => {
    const {
      issue: { number: issue_number },
      repo: { owner, repo }
    } = context;

    // Use the Github API to query for the list of files from the PR
    return github
      .paginate(
        'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
        { owner, repo, pull_number: issue_number },
        (response) => response.data.filter((file) => file.status === 'modified')
      )
      .then((files) => {
       
        console.log('Changed files: ', files);

        // Return the new files count to be used in the github workflow
        return files.length;
      });
  },
}
