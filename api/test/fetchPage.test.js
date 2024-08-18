const fetchPage = require('../services/fetchPage');

const apiAddress = 'https://httpbin.org';
const imageFormats = ['jpeg', 'png', 'webp', 'svg'];

describe('Fetch Page', () => {
  it('should resolve when attempting to fetch an HTML URL', async () => {
    await expectAsync(fetchPage(`${apiAddress}/html`)).toBeResolved();
  });

  it('should handle redirection correctly', async () => {
    const endPoint = `${apiAddress}/redirect-to?url=${apiAddress}/html`;
    await expectAsync(fetchPage(endPoint)).toBeResolved();
  });

  it('should reject redirection non-HTML URL', async () => {
    const endPoint = `${apiAddress}/redirect-to?url=${apiAddress}/image/jpeg`;
    await expectAsync(fetchPage(endPoint)).toBeRejected();
  });

  it('should reject when attempting to fetch a URL with an incorrect Content-Type', async () => {
    await expectAsync(fetchPage(`${apiAddress}/xml`)).toBeRejected();
  });

  it('should reject when attempting to fetch non-HTML URLs', async () => {
    const promises = imageFormats.map(async (format) => {
      const endPoint = `${apiAddress}/image/${format}`;
      return expectAsync(fetchPage(endPoint)).toBeRejected();
    });

    await Promise.all(promises);
  });
});
