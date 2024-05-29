const createEvent = async (res, event, data) => {
  const id = Date.now();
  const eventData = JSON.stringify(data);

  res.write(`event: ${event}\n`);
  res.write(`data: ${eventData}\n`);
  res.write(`id: ${id}\n\n`);
};

module.exports = createEvent;
