import getPage from './getPage';
import filterLink from './filterLink';
import extractLinks from './extractLinks';

const listLinks = async (url, visitedLinks = new Set()) => {
  try {
    const page = await getPage(url);
    const links = extractLinks(page);

    console.log('------------------');
    console.log('📌 ~ links ->', links);
    console.log('📌 ~ visitedLinks ->', visitedLinks);

    visitedLinks.add(url);

    const validLinks = links
      .filter((link) => filterLink(url, link))
      .map((link) => new URL(link, url).href)
      .filter((link) => !visitedLinks.has(link));

    console.log('📌 ~ validLinks ->', validLinks);

    await Promise.all(validLinks.map((link) => listLinks(link, visitedLinks)));
  } catch (error) {
    throw new Error(`Failed to list links: ${error.message}`);
  } finally {
    return visitedLinks;
  }
};

export default listLinks;
