const fetchPage = require('./fetchPage');
const filterLink = require('./filterLink');
const extractLinks = require('./extractLinks');
const createEvent = require('./createEvent');

const listLinks = async (
  res,
  url,
  visitedLinks = new Set(),
  errorList = []
) => {
  try {
    if (visitedLinks.has(url)) return { visitedLinks, errorList };

    visitedLinks.add(url);
    createEvent(res, 'New Link', {
      status: true,
      statusCode: 200,
      isProgress: true,
      message: 'New link found',
      uniqueLink: url,
    });

    const page = await fetchPage(url);
    const links = extractLinks(page);

    const validLinks = links
      .filter((link) => filterLink(url, link))
      .map((link) => new URL(link, url).href);

    await Promise.allSettled(
      validLinks.map((link) => listLinks(res, link, visitedLinks))
    );
  } catch (error) {
    errorList.push({ message: error.message, page: url });

    createEvent(res, 'Error', {
      status: true,
      statusCode: 200,
      isProgress: true,
      message: error.message,
      page: url,
      link: error.input,
    });
  }

  return { visitedLinks, errorList };
};

module.exports = listLinks;
