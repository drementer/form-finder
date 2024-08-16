const apiAddress = 'https://fe.burak.gricreative.com/api/forms';

const resultList = document.querySelector('[result-list]');
const searchInput = document.querySelector('[search-input]');

const counterContainer = document.querySelector('[counters]');
const pageCounter = document.querySelector('[counter="pages"]');
const formCounter = document.querySelector('[counter="forms"]');
const queueCounter = document.querySelector('[counter="queue"]');
const linkTemplate = document.querySelector('template');

const progressClass = '-progress';

const searchParameters = new URLSearchParams(window.location.search);
let siteUrl = searchParameters.get('url');

const sanitizeUrl = (url) => {
  const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
  return new URL(hasProtocol ? url : `https://${url}`).hostname;
};

const handleSearch = () => {
  if (!searchInput.checkValidity()) return;
  searchInput.value = sanitizeUrl(searchInput.value);
};

const createListItem = (url) => {
  const listItem = document.importNode(linkTemplate.content, true);
  const link = listItem.querySelector('a');
  const span = listItem.querySelector('span');

  link.href = url;
  span.textContent = url.replace(`https://${siteUrl}`, '');

  return listItem;
};

const appendNewLink = (event) => {
  const data = JSON.parse(event.data);
  const link = createListItem(data.processedUrl);
  resultList.appendChild(link);
};

const updateCounters = (event) => {
  const data = JSON.parse(event.data);

  pageCounter.textContent = data.processedLinks;
  formCounter.textContent = data.foundFormPages.length;
  queueCounter.textContent = data.processingQueue;
};

const connectService = () => {
  const eventSource = new EventSource(`${apiAddress}?site=https://${siteUrl}`);

  eventSource.addEventListener('Form Page found', appendNewLink);
  eventSource.addEventListener('Scanned Link', updateCounters);
  eventSource.addEventListener('Error', updateCounters);
  eventSource.addEventListener('Close Connection', () => {
    counterContainer.classList.remove(progressClass);
    eventSource.close();
  });
};

searchInput.addEventListener('input', handleSearch);

if (siteUrl) {
  siteUrl = sanitizeUrl(siteUrl);
  searchInput.value = siteUrl;

  counterContainer.classList.add(progressClass);
  resultList.scrollIntoView({ behavior: 'smooth', block: 'start' });

  connectService();
}
