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

const isExternalLink = (url) => url.startsWith('http') || url.startsWith('//');
const isIgnoredLink = (url) => regexIgnores.test(url);

const isSameDomain = (parentUrl, childUrl) => {
  return new URL(parentUrl).hostname === new URL(childUrl).hostname;
};

module.exports = (parent, href) => {
  if (isIgnoredLink(href)) return null;
  if (isExternalLink(href)) return isSameDomain(parent, href) ? href : null;

  return new URL(href, parent).href;
};
