const express = require('express');
const app = express();
const port = 3000;

const pages = require('./router/pages');

const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now());
  next();
};

app.use(timeLog);
app.use('/pages', pages);

app.listen(port, () => console.log(`APP ON: http://localhost:${port}`));
