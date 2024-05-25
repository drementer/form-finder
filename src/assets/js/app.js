const urlParams = new URLSearchParams(window.location.search);
const searchUrl = urlParams.get('url');
const searchBox = document.querySelector('[search-box]');

const apiAddress = 'http://localhost:3001/api/pages';

const isValidUrl = (url) => /^(http|https):\/\/[^ "]+$/.test(url);

const getSiteData = async (url) => {
  try {
    const response = await axios.get(`${apiAddress}?site=${url}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get site data: ${error}`);
  }
};

const filterUrl = (url) => {
  if (!isValidUrl(url)) url = `https://${url}`;
  return new URL(url).hostname;
};

searchBox.addEventListener('input', () => {
  const searchValue = searchBox.value;
  if (searchValue) searchBox.value = filterUrl(searchValue);
});

if (searchUrl) {
  searchBox.value = searchUrl;
  getSiteData(searchUrl);
}
