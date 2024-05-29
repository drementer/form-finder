const ignorePatterns = [
  '^javascript:',
  '.css$',
  '.ico$',
  '^#$',
  '^#none$',
  '^$',
  '@',
  '.png$',
  '.pdf$',
  '^tel:',
  '^sms:',
  '^mailto:',
  'admin',
  'login',
  'register',
];

const regexIgnores = new RegExp(ignorePatterns.join('|'), 'i');

const isExternalLink = (url) => /^(http|\/\/)/.test(url);
const isIgnoredLink = (url) => regexIgnores.test(url);

const isSameDomain = (parentUrl, childUrl) => {
  const parentHostname = new URL(parentUrl).hostname;
  const childHostname = new URL(childUrl).hostname;
  return parentHostname === childHostname;
};

const filterLink = (parent, href) => {
  if (isIgnoredLink(href)) return null;
  if (isExternalLink(href)) return isSameDomain(parent, href) ? href : null;

  return new URL(href, parent).href;
};

module.exports = filterLink;
