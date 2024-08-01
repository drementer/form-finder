const searchInput = document.querySelector('[search-input]');

{
  const handleSearch = () => {
    if (!searchInput.checkValidity()) return;
    searchInput.value = filterUrl(searchInput.value);
  };

  searchInput.addEventListener('input', handleSearch);
}

{
  const urlParams = new URLSearchParams(window.location.search);
  const resultList = document.querySelector('[result-list]');
  const apiAddress = 'http://localhost:3001/api/forms';
  let searchUrl = urlParams.get('url');

  const isValidUrl = (url) => /^(http|https):\/\/[^ "]+$/.test(url);

  const filterUrl = (url) => {
    if (!isValidUrl(url)) url = `https://${url}`;
    return new URL(url).hostname;
  };

  const createLinkBox = (url) => {
    const span = Object.assign(document.createElement('span'), {
      textContent: url.replace(`https://${searchUrl}`, ''),
    });

    const linkBox = Object.assign(document.createElement('a'), {
      href: url,
      target: '_blank',
      rel: 'noopener noreferrer',
      title: 'Open link in a new tab',
      className: 'link-box',
    });

    linkBox.appendChild(span);

    return linkBox;
  };

  const appendNewLink = (event) => {
    const data = JSON.parse(event.data);
    const link = createLinkBox(data.processedUrl);
    resultList.appendChild(link);
  };

  const connectService = (url) => {
    const eventSource = new EventSource(`${apiAddress}?site=https://${url}`);
    eventSource.addEventListener('Form Page found', appendNewLink);
    eventSource.addEventListener('Close Connection', eventSource.close);
  };

  if (searchUrl) {
    searchUrl = filterUrl(searchUrl);
    searchInput.value = searchUrl;
    connectService(searchUrl);
  }
}
