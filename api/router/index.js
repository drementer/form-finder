const express = require('express');
const router = express.Router();

const pages = require('./pages');

router.use('/pages', pages);
router.use('*', (req, res) => res.redirect('/404'));

module.exports = router;
