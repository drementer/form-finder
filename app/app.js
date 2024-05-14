const express = require('express');
const app = express();
const port = 3001;

const pages = require('./router/pages');

const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now());
  next();
};

app.use(timeLog);
app.use('/api/pages', pages);

app.listen(port, () => console.log(`APP ON: http://localhost:${port}`));

module.exports = app;
