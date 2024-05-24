const axios = require('axios');

const cache = {};

const getPage = async (url) => {
  try {
    if (cache[url]) return cache[url];

    const response = await axios.get(url);
    const pageData = response.data;

    cache[url] = pageData;

    return pageData;
  } catch (error) {
    throw new Error(`Failed to fetch page: ${url} - ${error.message}`);
  }
};

module.exports = getPage;
