const express = require('express');
const router = require('./router');

const app = express();
const port = 3001;

// add cors headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/api/', router);

app.listen(port, () => console.log(`APP ON: http://localhost:${port}`));

module.exports = app;
