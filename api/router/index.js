const express = require('express');
const router = express.Router();

const pages = require('./pages');

router.use('/pages', pages);

module.exports = router;
