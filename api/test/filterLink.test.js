const filterLink = require('../helpers/filterLink');

const parent = 'https://example.com';

const expectedLinks = [
  'https://example.com/1',
  'https://example.com/2',
  'https://example.com/2?parameter',
  'https://example.com/2?parameter#section-1',
  'https://example.com/2#section-1',
  'https://example.com/3',
  'https://example.com/#$',
];

const links = [
  'https://example.com/1',
  '/2',
  '/2?parameter',
  '/2?parameter#section-1',
  '/2#section-1',
  '/3',
  'javascript:alert("Hello")',
  'https://example.com/4.css',
  'https://example.com/5.ico',
  '#$',
  '#none',
  'mailto:',
  'tel:',
  'sms:',
  'mailto:test@example.com',
  'tel:+1234567890',
  'sms:+1234567890',
  'admin',
  'login',
  'register',
];

const filter = (link) => filterLink(parent, link);

describe('Filter Link', () => {
  it('should filter out ignored links', () => {
    const result = links.map(filter).filter(Boolean);
    expect(result).toEqual(expectedLinks);
  });

  it('should return false for external links', () => {
    const result = filter('https://external.com');
    expect(result).toBe(false);
  });
});
