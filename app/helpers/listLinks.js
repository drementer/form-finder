const filterLink = require('./filterLink');
const getPage = require('./getPage');
const extractLinks = require('./extractLinks');

const listLinks = async (url, visitedLinks = new Set()) => {
  try {
    const page = await getPage(url);
    const links = extractLinks(page).filter((link) => filterLink(url, link));

    visitedLinks.add(url);

    const absoluteLinks = links
      .map((link) => new URL(link, url).href)
      .filter((link) => !visitedLinks.has(link));

    await Promise.all(
      absoluteLinks.map((link) => listLinks(link, visitedLinks))
    );

    return visitedLinks;
  } catch (error) {
    throw new Error(`Failed to process ${url}: ${error.message}`);
  }
};

module.exports = listLinks;
