const express = require('express');
const router = express.Router();

const listLinks = require('../helpers/listLinks');

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  next();
});

router.get('/', async (req, res) => {
  const { site } = req.query;

  res.write('data: Connected\n\n');

  req.on('close', () => {
    console.log('Client disconnected');
  });

  await listLinks(res, site);
  res.end();
});

module.exports = router;
