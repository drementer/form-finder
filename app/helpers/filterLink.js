module.exports = (parent, href) => {
  const IGNORE_PATTERNS = [
    /^javascript:/,
    /\.css$/,
    /\.ico$/,
    /^#$/,
    /^#none$/,
    /^\$/,
    /@/,
    /\.png$/,
    /\.pdf$/,
    /^tel:/,
    /^sms:/,
    /^mailto:/,
    /admin/,
    /login/,
    /register/,
  ];
  const regexIgnores = new RegExp(IGNORE_PATTERNS.join('|'), 'i');

  const isExternalLink = (url) =>
    url.startsWith('http') || url.startsWith('//');
  const isIgnoredLink = (url) => regexIgnores.test(url);
  const isSameDomain = (parentUrl, childUrl) =>
    new URL(parentUrl).hostname === new URL(childUrl).hostname;

  if (isIgnoredLink(href)) return null;

  if (isExternalLink(href)) {
    return isSameDomain(parent, href) ? href : null;
  }

  return new URL(href, parent).href;
};
