const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

const DOMAIN = 'https://docs.amplify.aws';

const getSitemapUrls = async ({buildDir, localDomain}) => {
  const urlList = [];
  let siteMapParse;

  if(buildDir) {
    const siteMap = fs.readFileSync(`${buildDir}/sitemap.xml`);

    siteMapParse = cheerio.load(siteMap, {
      xml: true
    });
    
  } else {
    const baseDomain = localDomain ?? DOMAIN;
    try {
      const response = await axios.get(`${baseDomain}/sitemap.xml`);
      siteMapParse = cheerio.load(response.data);
    } catch (error) {
      console.log(`Sitemap url, ${baseDomain}/sitemap.xml, could not be parsed: ${error}`)
    }
  }

  siteMapParse('url').each(function () {
    urlList.push(siteMapParse(this).find('loc').text());
  });

  return urlList;
};

module.exports = {
  getSitemapUrls: async ({buildDir, localDomain}) => {
    return await getSitemapUrls({buildDir, localDomain});
  }
};
