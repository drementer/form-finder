const HTMLParser = require('node-html-parser');

const extractLinks = (html) => {
  try {
    const parsedHtml = HTMLParser.parse(html);
    const anchorTags = parsedHtml.querySelectorAll('a');

    return anchorTags.map((anchor) => anchor.getAttribute('href'));
  } catch (error) {
    throw new Error(`Error parsing HTML: ${error.message}`);
  }
};

module.exports = extractLinks;
