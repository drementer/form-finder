const { parse } = require('node-html-parser');

const fetchPage = require('./fetchPage');
const findForm = require('../helpers/findForm');
const filterLink = require('../helpers/filterLink');
const extractLinks = require('../helpers/extractLinks');
const createEvent = require('../helpers/createEvent');

const pageScraper = async (
  res,
  baseUrl,
  processingLinks = new Set(),
  processedLinks = new Set(),
  foundFormPages = new Set(),
  processingQueue = new Set(),
  errorLogs = []
) => {
  try {
    processingLinks.add(baseUrl);

    const retrievedPage = await fetchPage(baseUrl);
		const parsedPage = parse(retrievedPage);
    const extractedLinks = extractLinks(parsedPage);
    const haveForm = findForm(parsedPage);
    const linksToProcess = new Set();

    processedLinks.add(baseUrl);
    processingQueue.delete(baseUrl);

    extractedLinks.map((link) => {
      const filteredLink = filterLink(baseUrl, link);
      if (!filteredLink) return;

      const isVisited = processingLinks.has(filteredLink);
      if (isVisited) return;

      linksToProcess.add(filteredLink);
      processingQueue.add(filteredLink);
    });

    if (haveForm) {
      foundFormPages.add(baseUrl);

      createEvent(res, 'Form Page found', {
        status: true,
        statusCode: 200,
        message: 'Form page found',
        processedUrl: baseUrl,
        foundFormPages: [...foundFormPages],
				processedLinks: processedLinks.size,
				processingQueue: processingQueue.size,
      });
    }

    createEvent(res, 'Scanned Link', {
      status: true,
      statusCode: 200,
      message: 'Link scanned successfully',
      processedUrl: baseUrl,
      foundFormPages: [...foundFormPages],
      processedLinks: processedLinks.size,
      processingQueue: processingQueue.size,
    });

    await Promise.allSettled(
      [...linksToProcess].map((link) =>
        pageScraper(
          res,
          link,
          processingLinks,
          processedLinks,
          foundFormPages,
          processingQueue,
          errorLogs
        )
      )
    );
  } catch (error) {
    processingQueue.delete(baseUrl);
    errorLogs.push({
      message: error.message,
      processedUrl: baseUrl,
      link: error.input,
    });

    createEvent(res, 'Error', {
      status: false,
      statusCode: 500,
      message: `Error on ${error.input}`,
      processedUrl: baseUrl,
      foundFormPages: [...foundFormPages],
      processedLinks: processedLinks.size,
      processingQueue: processingQueue.size,
    });
  }

  return { processedLinks, foundFormPages, errorLogs };
};

module.exports = pageScraper;
