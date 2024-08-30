const { parse } = require('node-html-parser');
const findAnchorTags = require('../helpers/findAnchorTags');

const document = parse(`
  <a href="https://example.com/1">Full URL</a>
  <a href="/2">Just Path</a>
  <a href="/2?parameter">Just Path</a>
  <a href="/2?parameter#section-1">Just Path</a>
  <a href="/2#section-1">Just Path</a>
  <a href="/3 ">Just Path with space</a>
  <a href="">Empty href</a>
  <a>NO HREF</a>
  <div>WHO AM I?</div>
  <div href="/wtf">WHO AM I?</div>
`);

const expectedLinks = [
  'https://example.com/1',
  '/2',
  '/2?parameter',
  '/2?parameter#section-1',
  '/2#section-1',
  '/3',
];

describe('Extract Links', () => {
  it('should return an array of valid href links', () => {
    const links = findAnchorTags(document);
    expect(links).toEqual(expectedLinks);
  });
});
