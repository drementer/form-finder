import { get } from 'axios';

export default async (url) => {
  try {
    const page = await get(url);
    return page.data;
  } catch (error) {
    throw new Error(`Failed to fetch page: ${url} - ${error.message}`);
  }
};
