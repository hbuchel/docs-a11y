module.exports = {
  runAxe: (pages) => {
    const { exec } = require('child_process');
    pages.forEach((page) => {
      console.log('page: ', page);
      exec(`axe http://localhost:3000/${ page } --exit`);
    })
  }
};
