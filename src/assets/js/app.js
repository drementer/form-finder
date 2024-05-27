const urlParams = new URLSearchParams(window.location.search);
const searchUrl = urlParams.get('url');
const searchBox = document.querySelector('[search-box]');
const resultList = document.querySelector('[result-list]');
const apiAddress = 'http://localhost:3001/api/pages';

const isValidUrl = (url) => /^(http|https):\/\/[^ "]+$/.test(url);

const createLinkBox = (url) => {
  return Object.assign(document.createElement('a'), {
    href: url,
    textContent: url,
    target: '_blank',
    rel: 'noopener noreferrer',
    title: 'Open link in a new tab',
  });
};

const appendNewLink = (event) => {
  const data = JSON.parse(event.data);
  const link = createLinkBox(data.uniqueLink);
  resultList.appendChild(link);
};

const connectService = (url) => {
  const eventSource = new EventSource(`${apiAddress}?site=https://${url}`);
  eventSource.addEventListener('New Link', appendNewLink);
  eventSource.addEventListener('Close Connection', eventSource.close);
};

const filterUrl = (url) => {
  if (!isValidUrl(url)) url = `https://${url}`;
  return new URL(url).hostname;
};

const handleSearch = () => {
  const searchValue = searchBox.value;
  if (searchValue) searchBox.value = filterUrl(searchValue);
};

searchBox.addEventListener('input', handleSearch);

if (searchUrl) {
  const filteredUrl = filterUrl(searchUrl);
  searchBox.value = filteredUrl;
  connectService(filteredUrl);
}
