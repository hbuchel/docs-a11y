import { getSitemapUrls } from './tasks/link-checker';
import { exec } from 'child_process';

export const runAxe = async (pages) => {
  pages.forEach((page) => {
    console.log('page: ', page);
    exec(`axe http://localhost:3000${ page } --exit`, (stdout) => {
      console.log(stdout);
    });
  })
}

