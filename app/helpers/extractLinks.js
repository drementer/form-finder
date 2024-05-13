const HTMLParser = require('node-html-parser');

module.exports = (html) => {
  try {
    const parsedHtml = HTMLParser.parse(html);
    const anchorTags = parsedHtml.querySelectorAll('a');

    return anchorTags.map((anchor) => anchor.getAttribute('href'));
  } catch (error) {
    throw new Error(`Error parsing HTML: ${error.message}`);
  }
};
