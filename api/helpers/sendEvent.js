/**
 * Creates event data from the given message and context.
 *
 * @param {string} message - The message to include in the event data.
 * @param {object} context - The context containing additional information.
 *
 * @returns {object} The created event data.
 */
const createEventData = (message, context) => ({
	message,
  processedUrl: context.baseUrl,
  parentUrl: context.parentUrl,
  processingQueueSize: context.processingQueue.size,
  processedLinksSize: context.processedLinks.size,
  formPageSize: context.formPages.size,
  errorSize: context.errorLogs.length,
  ...context.customFields,
});

/**
 * Sends an event with the given message and context.
 *
 * @param {string} event - The event type.
 * @param {string} message - The message to include in the event.
 * @param {object} context - The context containing additional information.
 *
 * @returns {object} The event details including ID, event type, and event data.
 */
const sendEvent = (event, detail, context) => {
  const id = Date.now();
  const eventData = createEventData(detail, context);

  context.res.write(`event: ${event}\n`);
  context.res.write(`data: ${JSON.stringify(eventData)}\n`);
  context.res.write(`id: ${id}\n\n`);

  return { id, event, eventData };
};

module.exports = sendEvent;
