const urlParams = new URLSearchParams(window.location.search);
const resultList = document.querySelector('[result-list]');
const apiAddress = 'https://fe.burak.gricreative.com/api/pages';
let searchUrl = urlParams.get('url');

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

if (searchUrl) {
  searchUrl = filterUrl(searchUrl);
  searchInput.value = searchUrl;
  connectService(searchUrl);
}
