export default ({ name, phone }) => {
  const errors = [];
  const presenceMessage = "can't be blank";

  if (!name || name === '') {
    errors.push({ source: 'name', title: presenceMessage });
  }

  if (!phone || phone === '') {
    errors.push({ source: 'phone', title: presenceMessage });
  }

  return errors;
};
