const urlParams = new URLSearchParams(window.location.search);
const searchUrl = urlParams.get('url');

const searchBar = document.querySelector('[search-bar]');
const searchInput = document.querySelector('[search-input]');
const resultSection = document.querySelector('[result]');
const resultList = document.querySelector('[result-list]');

const apiAddress = '/api/pages';

const isValidUrl = (url) => /^(http|https):\/\/[^ "]+$/.test(url);

const createLinkBox = (url) => {
  return Object.assign(document.createElement('a'), {
    href: url,
    textContent: url.replace(`https://${searchUrl}`, ''),
    target: '_blank',
    rel: 'noopener noreferrer',
    title: 'Open link in a new tab',
    classList: ['link-box'],
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
  const searchValue = searchInput.value;
  if (searchValue) searchInput.value = filterUrl(searchValue);
};

searchInput.addEventListener('input', handleSearch);

searchBar.style.top = `${-searchBar.clientHeight * 0.6}px`;
let lastScroll = 0;

window.addEventListener('resize', () => {
  searchBar.style.top = `${-searchBar.clientHeight * ((100 / 3) * 2)}px`;
});

window.addEventListener('scroll', () => {
  const isResultVisible = resultSection.getBoundingClientRect().top < 0;
  const isReverseScroll = window.scrollY < lastScroll;
  lastScroll = window.scrollY;

  if (!isResultVisible) return searchBar.classList.remove('-show');
  searchBar.classList.toggle('-show', isReverseScroll);
});

if (searchUrl) {
  const filteredUrl = filterUrl(searchUrl);
  searchInput.value = filteredUrl;
  connectService(filteredUrl);
}
