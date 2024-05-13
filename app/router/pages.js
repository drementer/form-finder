const express = require('express');
const router = express.Router();

const listLinks = require('../helpers/listLinks');

router.get('/', async (req, res) => {
  const site = req.query.site;

  if (!site) {
    return res.status(400).json({
      status: false,
      error: `The 'Site' parameter is required!'`,
      data: [],
    });
  }

  try {
    const visitedLinks = await listLinks(site);
    res.status(200).json({
      status: true,
      error: null,
      data: [...visitedLinks],
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: `Error processing request: ${error.message}`,
      data: [],
    });
  }
});

module.exports = router;
