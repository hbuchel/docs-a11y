module.exports = {
  runAxe: (pages) => {
    const { exec } = require('child_process');
    const { getSiteMapUrls } = require('./tasks/link-checker'); 
    pages.forEach((page) => {
      console.log('page: ', page);
      exec(`axe http://localhost:3000${ page } --exit`, (stdout) => {
        console.log(stdout);
      });
    })
  }
};
