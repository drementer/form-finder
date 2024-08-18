/**
 * Extracts and trims the href attribute from an anchor element.
 *
 * @param {HTMLElement} anchor - The anchor element.
 * @returns {string|null} The trimmed href attribute or null if not present.
 */
const extractHref = (anchor) => anchor.getAttribute('href')?.trim();

/**
 * Extracts valid href links from a parsed HTML document.
 *
 * @param {HTMLElement[]} html - The parsed HTML document.
 * @returns {Array} The list of valid href links.
 */
const extractLinks = (html) => {
  const anchorTags = html.querySelectorAll('a');
  return anchorTags.map(extractHref).filter(Boolean);
};

module.exports = extractLinks;
