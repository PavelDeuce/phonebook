let id = 1000;

export const nextId = () => {
  id += 1;
  return id;
};

export const getParams = (address, host) => {
  const url = new URL(address, `http://${host}`);
  return Object.fromEntries(url.searchParams);
};
