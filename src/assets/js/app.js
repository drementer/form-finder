const urlParams = new URLSearchParams(window.location.search);
const searchUrl = urlParams.get('url');

const searchBox = document.querySelector('[search-box]');

const isValidUrl = (url) => {
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  return urlRegex.test(url);
};

const getSiteData = async (url) => {
  try {
    const response = await axios.get(`/api/pages?site=${url}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to get site data: ${error}`);
  }
};

const filterUrl = (url) => {
  if (!isValidUrl(url)) url = `https://${url}`;

  return new URL(searchValue).hostname;
};

if (searchUrl) {
  searchBox.value = searchUrl;
  getSiteData(searchUrl);
}

searchBox.addEventListener('input', () => {
  const searchValue = searchBox.value;

  if (searchValue) searchBox.value = filterUrl(searchValue);
});
