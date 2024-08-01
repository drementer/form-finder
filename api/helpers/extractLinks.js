/**
 * Extracts all hyperlink references (href) from the provided HTML string.
 *
 * @param {string} html - The HTML content to parse.
 * @returns {string[]} - An array of hyperlink references.
 * @throws {Error} - Throws an error if parsing fails.
 */
const extractLinks = (html) => {
  try {
    const anchorTags = html.querySelectorAll('a');
    return anchorTags.map((anchor) => anchor.getAttribute('href'));
  } catch (error) {
    throw new Error(`Error parsing HTML: ${error.message}`);
  }
};

module.exports = extractLinks;
