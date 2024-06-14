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
  const { processedUrls, errorLogs } = await pageScraper(res, site);

  createEvent(res, 'Close Connection', {
    status: true,
    statusCode: 200,
    isProgress: false,
    message: 'Connection closed',
    uniqueLink: null,
  });

  console.log({ site, processedUrls, errorLogs });

  res.end();

  req.on('close', () => {
    console.log('Client disconnected');
  });
});

module.exports = router;
