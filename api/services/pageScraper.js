const { parse } = require('node-html-parser');

const fetchPage = require('./fetchPage');
const findForm = require('../helpers/findForm');
const findAnchorTags = require('../helpers/findAnchorTags');
const extractLinks = require('../helpers/extractLinks');
const sendEvent = require('../helpers/sendEvent');

const defaultContext = {
  res: null,
  baseUrl: null,
  parentUrl: null,
  uniqueLinks: new Set(),
  processingQueue: new Set(),
  processedLinks: new Set(),
  formPages: new Set(),
  errorLogs: [],
};

const pageScraper = async (context) => {
  try {
    context = { ...defaultContext, ...context };
    context.uniqueLinks.add(context.baseUrl);

    const retrievedPage = await fetchPage(context.baseUrl);
    const parsedPage = parse(retrievedPage);
    const anchorTags = findAnchorTags(parsedPage);
    const linksToProcess = extractLinks(context, anchorTags);
    const forms = findForm(parsedPage);
    const pageTitle = parsedPage.querySelector('title').text?.trim();

    const scrapLink = (link) => pageScraper({ ...context, baseUrl: link });

    linksToProcess.forEach((link) => context.processingQueue.add(link));
    context.processedLinks.add(context.baseUrl);
    context.processingQueue.delete(context.baseUrl);

    if (forms) {
      const customFields = { forms };

      context.formPages.add({ url: context.baseUrl, title: pageTitle, forms });
      sendEvent('Form Page', 'Form page found', { ...context, customFields });
    }

    sendEvent('Scanned Link', 'Link scanned successfully', context);

    await Promise.allSettled([...linksToProcess].map(scrapLink));
  } catch (error) {
    context.processingQueue.delete(context.baseUrl);
    context.processedLinks.add(context.baseUrl);

    context.errorLogs.push({
      message: error.message,
      sourceUrl: context.parentUrl,
      processedUrl: context.baseUrl,
    });

    sendEvent('Error', `Error ${error.message}`, context);
  }

  return context;
};

module.exports = pageScraper;
