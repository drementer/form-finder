const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');
const HTMLParser = require('node-html-parser');

const baseUrl = 'https://kilincarslan.dev/';
const visitedLinks = [];

const getPage = async (url) => {
  if (url.startsWith('/')) url = baseUrl + url;

  const page = await axios.get(url);
  return page.data;
};

const getLinks = (html) => {
  const root = HTMLParser.parse(html);
  const links = root.querySelectorAll('a');
  return links.map((link) => link.getAttribute('href'));
};

const listLinks = async (url) => {
  if (visitedLinks.includes(url)) return;

  const page = await getPage(url);
  const links = getLinks(page);

  visitedLinks.push(url);
  for (const link of links) await listLinks(link);
};

app.get('/', async (req, res) => {
  await listLinks(baseUrl);
  console.log('📌 ~ visitedLinks ->', visitedLinks);
  res.status(200).send(visitedLinks);
});

app.listen(port, () => {
  console.log(`APP ON: https://localhost:${port}`);
});
