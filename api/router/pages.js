const express = require('express');
const router = express.Router();

const listLinks = require('../helpers/listLinks');
const createEvent = require('../helpers/createEvent');

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  next();
});

router.get('/', async (req, res) => {
  const { site } = req.query;

  const { visitedLinks, errorList } = await listLinks(res, site);

  console.log('📌 ~ visitedLinks ->', visitedLinks);
  console.log('📌 ~ errorList ->', errorList);

  createEvent(res, 'Close Connection', {
    status: true,
    statusCode: 200,
    isProgress: false,
    message: 'Connection closed',
    uniqueLink: null,
  });

  res.end();

  req.on('close', () => {
    console.log('Client disconnected');
  });
});

module.exports = router;
