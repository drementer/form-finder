const searchInput = document.querySelector('[search-input]');

const isValidUrl = (url) => /^(http|https):\/\/[^ "]+$/.test(url);

const filterUrl = (url) => {
  if (!isValidUrl(url)) url = `https://${url}`;
  return new URL(url).hostname;
};

const handleSearch = () => {
  if (!searchInput.checkValidity()) return;
  searchInput.value = filterUrl(searchValue);
};

searchInput.addEventListener('input', handleSearch);
