const axios = require('axios');
const https = require('https');

const axiosConfig = {
  httpsAgent: new https.Agent({ keepAlive: true }),
  responseType: 'text',
};

const httpClient = axios.create(axiosConfig);

/**
 * Fetches the content of the specified URL.
 *
 * @param {string} url - The URL of the page to fetch.
 * @returns {Object} - The content of the fetched page.
 * @throws {Error} - Throws an error if parsing fails.
 */
const fetchPage = async (url) => {
  try {
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = fetchPage;
