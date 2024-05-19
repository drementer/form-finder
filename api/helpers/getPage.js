const axios = require('axios');

export default async (url) => {
  try {
    const page = await axios.get(url);
    return page.data;
  } catch (error) {
    throw new Error(`Failed to fetch page: ${url} - ${error.message}`);
  }
};
