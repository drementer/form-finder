const fetchPage = require('./fetchPage');
const filterLink = require('../helpers/filterLink');
const extractLinks = require('../helpers/extractLinks');
const createEvent = require('../helpers/createEvent');

const pageScraper = async (
  res,
  baseUrl,
  processedUrls = new Set(),
  scannedLinks = new Set(),
  queue = new Set(),
  errorLogs = []
) => {
  try {
    processedUrls.add(baseUrl);

    const retrievedPage = await fetchPage(baseUrl);
    const extractedLinks = extractLinks(retrievedPage);
    const linksToProcess = new Set();

    queue.delete(baseUrl);
    scannedLinks.add(baseUrl);

    extractedLinks.map((link) => {
      const filteredLink = filterLink(baseUrl, link);
      if (!filteredLink) return;

      const isVisited = processedUrls.has(filteredLink);
      if (isVisited) return;

      linksToProcess.add(filteredLink);
      queue.add(filteredLink);
    });

    createEvent(res, 'New Link', {
      status: true,
      statusCode: 200,
      isProgress: true,
      message: 'New link found',
      uniqueLink: baseUrl,
      visitedLinks: scannedLinks.size,
      queue: queue.size,
    });

    await Promise.allSettled(
      [...linksToProcess].map((link) =>
        pageScraper(res, link, processedUrls, scannedLinks, queue, errorLogs)
      )
    );
  } catch (error) {
    queue.delete(baseUrl);
    errorLogs.push({
      message: error.message,
      page: baseUrl,
      link: error.input,
    });

    createEvent(res, 'Error', {
      status: true,
      statusCode: 200,
      isProgress: true,
      message: error.message,
      page: baseUrl,
      link: error.input,
    });
  }

  return { processedUrls, errorLogs };
};

module.exports = pageScraper;
