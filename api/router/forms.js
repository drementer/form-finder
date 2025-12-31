const express = require('express');
const router = express.Router();

const pageScraper = require('../services/pageScraper');
const sendEvent = require('../helpers/sendEvent');

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

  const scraper = await pageScraper({ res, baseUrl: site });
  const customFields = {
    formPages: [...scraper.formPages],
    errorLogs: scraper.errorLogs,
  };

  sendEvent('Complete', `Processing completed for ${site}`, {
    ...scraper,
    customFields,
  });

  res.end();
});

module.exports = router;
