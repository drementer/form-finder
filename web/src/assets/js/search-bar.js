const searchBar = document.querySelector('[search-bar]');
const resultSection = document.querySelector('[result]');

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
