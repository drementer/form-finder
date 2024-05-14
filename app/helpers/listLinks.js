const getPage = require('./getPage');
const filterLink = require('./filterLink');
const extractLinks = require('./extractLinks');

const listLinks = async (url, visitedLinks = new Set()) => {
  try {
    const page = await getPage(url);
    const links = extractLinks(page);

    console.log('------------------');
    console.log('📌 ~ links ->', links);
    console.log('📌 ~ visitedLinks ->', visitedLinks);

    visitedLinks.add(url);

    const validLinks = links
      .filter((link) => !link.includes(' '))
      .filter((link) => filterLink(url, link))
      .map((link) => new URL(link, url).href || null)
      .filter((link) => !visitedLinks.has(link));

    console.log('📌 ~ validLinks ->', validLinks);

    await Promise.all(validLinks.map((link) => listLinks(link, visitedLinks)));
  } catch (error) {
    console.log('📌 ~ error ->', error);
  } finally {
    return visitedLinks;
  }
};

module.exports = listLinks;
