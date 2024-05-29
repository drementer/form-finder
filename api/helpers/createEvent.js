/**
 * Sends a server-sent event to the client.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} event - The name of the event.
 * @param {Object} data - The data to send with the event.
 */
const createEvent = async (res, event, data) => {
  const id = Date.now();
  const eventData = JSON.stringify(data);

  res.write(`event: ${event}\n`);
  res.write(`data: ${eventData}\n`);
  res.write(`id: ${id}\n\n`);
};

module.exports = createEvent;
