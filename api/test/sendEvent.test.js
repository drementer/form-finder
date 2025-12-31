const sendEvent = require('../helpers/sendEvent');

describe('Send Event', () => {
  const res = { write: jasmine.createSpy('write') };
  const statusCode = 200;
  const event = 'testEvent';
  const message = 'This is a test message';
  const context = {
    parentUrl: 'http://example.com',
    baseUrl: 'http://example.com/page',
    processingQueue: { size: 5 },
    processedLinks: { size: 10 },
    formPages: { size: 3 },
    forms: [{ id: 1 }, { id: 2 }],
  };

  const result = sendEvent(res, statusCode, event, message, context);

  it('should call res.write three times', () => {
    expect(res.write).toHaveBeenCalledTimes(3);
  });

  it('should write the correct event line', () => {
    expect(res.write).toHaveBeenCalledWith(`event: ${event}\n`);
  });

  it('should write the correct id line', () => {
    expect(res.write).toHaveBeenCalledWith(`id: ${result.id}\n\n`);
  });

  it('should write the correct data line', () => {
    expect(res.write).toHaveBeenCalledWith(
      `data: ${JSON.stringify({
        statusCode,
        message,
        parentUrl: context.parentUrl,
        processedUrl: context.baseUrl,
        processingQueueSize: context.processingQueue.size,
        processedLinksSize: context.processedLinks.size,
        formPageSize: context.formPages.size,
        forms: context.forms,
      })}\n`
    );
  });
});
