module.exports = {
  runAxe: (pages) => {
    console.log('pages: ', pages);
    pages.forEach((page) => {
      console.log('page: ', page);
    })
  }
};
