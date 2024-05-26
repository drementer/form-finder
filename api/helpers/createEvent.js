const createEvent = async (res, event, data) => {
  const id = new Date().getTime();

  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n`);
  res.write(`id: ${id}\n\n`);
};

module.exports = createEvent;
