const express = require('express');
const router = express.Router();

const forms = require('./forms');

router.use('/forms', forms);

module.exports = router;
