const getPage = require('./getPage');
const filterLink = require('./filterLink');
const extractLinks = require('./extractLinks');

const listLinks = async (res, url, visitedLinks = new Set()) => {
  try {
    if (visitedLinks.has(url)) return;

    console.log('📌 ~ url ->', url);
    console.log('📌 ~ has visited before ->', visitedLinks.has(url));

    visitedLinks.add(url);
    res.write(`event: New Link\n`);
    res.write(`data: ${url}\n\n`);

    const page = await getPage(url);
    const links = extractLinks(page);

    const validLinks = links
      .filter((link) => filterLink(url, link))
      .map((link) => new URL(link, url).href);

    await Promise.allSettled(
      validLinks.map((link) => listLinks(res, link, visitedLinks))
    );
  } catch (error) {
    res.write(`event: Error\n`);
    res.write(
      `data: ${JSON.stringify({
        message: error.message,
        page: url,
        link: error.input,
      })}\n\n`
    );
  }
};

module.exports = listLinks;
