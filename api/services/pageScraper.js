const { parse } = require('node-html-parser');

const fetchPage = require('./fetchPage');
const findForm = require('../helpers/findForm');
const filterLink = require('../helpers/filterLink');
const extractLinks = require('../helpers/extractLinks');
const createEvent = require('../helpers/createEvent');

const pageScraper = async (
  res,
  baseUrl,
  parentUrl       = baseUrl,
  uniqueLinks     = new Set(),
  processingQueue = new Set(),
  processedLinks  = new Set(),
  formPages       = new Set(),
  errorLogs       = []
) => {
  try {
    uniqueLinks.add(baseUrl);

    const retrievedPage = await fetchPage(baseUrl);
    const parsedPage = parse(retrievedPage);
    const extractedLinks = extractLinks(parsedPage);
    const forms = findForm(parsedPage);

    const linksToProcess = new Set();

    processedLinks.add(baseUrl);
    processingQueue.delete(baseUrl);

    extractedLinks.map((link) => {
      const filteredLink = filterLink(baseUrl, link);
      if (!filteredLink) return;

      const isVisited = uniqueLinks.has(filteredLink);
      if (isVisited) return;

      linksToProcess.add(filteredLink);
      processingQueue.add(filteredLink);
    });

    if (forms) {
      const formPage = {
        url: baseUrl,
        title: parsedPage.querySelector('title').text.trim(),
        forms,
      };

      formPages.add(formPage);

      createEvent(res, 'Form Page', {
        statusCode         : 200,
        message            : 'Form page found',
        pageTitle          : formPage.title,
        sourceUrl          : parentUrl,
        processedUrl       : baseUrl,
        processingQueueSize: processingQueue.size,
        processedLinksSize : processedLinks.size,
        forms,
      });
    }

    createEvent(res, 'Scanned Link', {
      statusCode         : 200,
      message            : 'Link scanned successfully',
      sourceUrl          : parentUrl,
      processedUrl       : baseUrl,
      processingQueueSize: processingQueue.size,
      processedLinksSize : processedLinks.size,
      forms              : null,
    });

    await Promise.allSettled(
      [...linksToProcess].map((link) =>
        pageScraper(
          res,
          link,
          baseUrl,
          uniqueLinks,
          processingQueue,
          processedLinks,
          formPages,
          errorLogs
        )
      )
    );
  } catch (error) {
    processingQueue.delete(baseUrl);
    processedLinks.add(baseUrl);

    errorLogs.push({
      message     : error.message,
      sourceUrl   : parentUrl,
      processedUrl: baseUrl,
    });

    createEvent(res, 'Error', {
      statusCode         : 500,
      message            : `Error ${error.message}`,
      sourceUrl          : parentUrl,
      processedUrl       : baseUrl,
      processingQueueSize: processingQueue.size,
      processedLinksSize : processedLinks.size,
    });
  }

  return { processedLinks, formPages, errorLogs };
};

module.exports = pageScraper;
