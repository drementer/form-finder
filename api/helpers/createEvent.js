/**
 * Sends a server-sent event to the client.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} event - The name of the event.
 * @param {Object} data - The data to send with the event.
 */
const createEvent = (res, event, data) => {
  const id = Date.now();

  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n`);
  res.write(`id: ${id}\n\n`);

  return { id, event, data };
};

module.exports = createEvent;
