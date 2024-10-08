const { parse } = require('node-html-parser');

const fetchPage = require('./fetchPage');
const findForm = require('../helpers/findForm');
const filterLink = require('../helpers/filterLink');
const extractLinks = require('../helpers/extractLinks');
const createEvent = require('../helpers/createEvent');

const pageScraper = async (
  res,
  baseUrl,
  parentUrl = baseUrl,
  uniqueLinks = new Set(),
  processingQueue = new Set(),
  processedLinks = new Set(),
  formPages = new Set(),
  errorLogs = []
) => {
  try {
    uniqueLinks.add(baseUrl);

    const retrievedPage = await fetchPage(baseUrl);
    const parsedPage = parse(retrievedPage);
    const extractedLinks = extractLinks(parsedPage);
    const forms = findForm(parsedPage);
    const pageTitle = parsedPage.querySelector('title').text?.trim();

    const linksToProcess = new Set();

    const sendEvent = (event, message, forms) => {
      createEvent(res, event, {
        statusCode         : 200,
        message,
        pageTitle,
        sourceUrl          : parentUrl,
        processedUrl       : baseUrl,
        processingQueueSize: processingQueue.size,
        processedLinksSize : processedLinks.size,
        formPageSize       : formPages.size,
        forms,
      });
    };

    const scrapLink = (link) => {
      return pageScraper(
        res,
        link,
        baseUrl,
        uniqueLinks,
        processingQueue,
        processedLinks,
        formPages,
        errorLogs
      );
    };

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
      formPages.add({ url: baseUrl, title: pageTitle, forms });
      sendEvent('Form Page', 'Form page found', forms);
    }

    sendEvent('Scanned Link', 'Link scanned successfully');

    await Promise.allSettled([...linksToProcess].map(scrapLink));
  } catch (error) {
    processingQueue.delete(baseUrl);
    processedLinks.add(baseUrl);

    errorLogs.push({
      message: error.message,
      sourceUrl: parentUrl,
      processedUrl: baseUrl,
    });

    createEvent(res, 'Error', {
      statusCode: 500,
      message: `Error ${error.message}`,
      sourceUrl: parentUrl,
      processedUrl: baseUrl,
      processingQueueSize: processingQueue.size,
      processedLinksSize: processedLinks.size,
      formPageSize: formPages.size,
    });
  }

  return { processedLinks, formPages, errorLogs };
};

module.exports = pageScraper;
