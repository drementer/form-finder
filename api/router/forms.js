const express = require('express');
const router = express.Router();

const pageScraper = require('../services/pageScraper');
const createEvent = require('../helpers/createEvent');

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Connection', 'keep-alive');

  next();
});

router.get('/', async (req, res) => {
  const { site } = req.query;
  const scraper = await pageScraper(res, site);

  createEvent(res, 'Complete', {
    statusCode        : 200,
    message           : `Processing completed for ${site}`,
    processedUrl      : site,
    processedLinksSize: scraper.processedLinks.size,
    formPageSize      : scraper.formPages.size,
    errorSize         : scraper.errorLogs.length,
    formPages         : [...scraper.formPages],
    errorLogs         : [...scraper.errorLogs],
  });

  res.end();
});

module.exports = router;
