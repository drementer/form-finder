const express = require('express');
const router = require('./router');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/api/', router);

module.exports = app;
