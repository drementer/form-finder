const express = require('express');
const router = express.Router();

const listLinks = require('../helpers/listLinks');

router.get('/', async (req, res) => {
  const { site } = req.query;
  const startTime = Date.now();

  const response = {
    status: true,
    statusCode: 200,
    errors: [],
    executionTime: '',
    uniqueLinks: null,
  };

  if (!site) {
    return res.status(400).json({
      status: false,
      statusCode: 400,
      errors: [{ message: `The 'Site' parameter is required!'` }],
      executionTime: null,
      data: null,
    });
  }

  try {
    const { visitedLinks, errorList } = await listLinks(site);

    response.errors = errorList;
    response.uniqueLinks = [...visitedLinks];
  } catch (error) {
    response.status = false;
    response.statusCode = 500;
    response.errors = [{ message: error.message, page: site }];
  }

  response.executionTime = `${Date.now() - startTime}ms`;
  res.status(response.statusCode).json(response);
});

module.exports = router;
