const express = require('express');
const app = express();
const port = 3001;

const router = require('./router');

const timeLog = (req, res, next) => {
  console.log('Time: ', Date.now());
  next();
};

app.use(timeLog);
app.use('/api/', router);

app.listen(port, () => console.log(`APP ON: http://localhost:${port}`));

module.exports = app;
