const filterLink = require('./filterLink');

const extractLink = (context, anchorTags) => {
  const linksToProcess = new Set();

  anchorTags.map((link) => {
    const filteredLink = filterLink(context.baseUrl, link);
    if (!filteredLink) return;

    const isVisited = context.uniqueLinks.has(filteredLink);
    if (isVisited) return;

    linksToProcess.add(filteredLink);
  });

  return linksToProcess;
};

module.exports = extractLink;
