const express = require('express');
const router = require('./router');

const app = express();
const port = 3001;

const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now());
  res.status(200).send('Time: ' + Date.now());
};

app.use(timeLog);

app.listen(port, () => console.log(`APP ON: http://localhost:${port}`));

module.exports = app;
