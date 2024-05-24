const axios = require('axios');
const https = require('https');

const pageRequest = axios.create({
  httpsAgent: new https.Agent({ keepAlive: true }),
  responseType: 'text',
});

const getPage = async (url) => {
  try {
    const page = await pageRequest(url);
    return page.data;
  } catch (error) {
    throw new Error(`Failed to fetch page: ${url} - ${error.message}`);
  }
};

module.exports = getPage;
