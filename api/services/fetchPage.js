const axios = require('axios');
const https = require('https');

const httpClient = axios.create({
  httpsAgent: new https.Agent({ keepAlive: true }),
  responseType: 'text',
  timeout: 15000,
  headers: {
    Accept: 'text/html',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
});

/**
 * Fetches the content of the specified URL.
 *
 * @param {string} url - The URL of the page to fetch.
 * @returns {string} - The content of the fetched page.
 * @throws {Error} - Throws an error if the response is not HTML or if a redirect occurs to a different origin.
 */
const fetchPage = async (url) => {
  try {
    const response = await httpClient.get(url);

    const responseUrl = response.request.res.responseUrl;
    const isSameOrigin = new URL(url).origin === new URL(responseUrl).origin;
    if (!isSameOrigin)
      throw new Error('Redirected to a different origin');

    const contentType = response.headers['content-type'] || '';
    const isHtmlContent = contentType.includes('text/html');
    const hasDocType = response.data.startsWith('<!DOCTYPE html>');
    const isHtmlType = isHtmlContent || hasDocType;
    if (!isHtmlType) throw new Error('Non-HTML content received');

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch page: ${error.message}`, { cause: error });
  }
};

module.exports = fetchPage;
