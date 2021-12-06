import fs from 'fs/promises';
import debug from 'debug';
import _ from 'lodash';
import makeServer from './server/index.js';

const log = debug('phonebook');

export default async (port, callback = () => {}) => {
  const data = await fs.readFile('data/phonebook.txt');
  const users = data
    .toString()
    .trim()
    .split('\n')
    .map((value) => value.split('|').map((item) => item.trim()));
  const usersIds = users.map(([id]) => id);
  const usersData = users.map(([, name, phone]) => ({ name, phone }));
  const usersById = _.zipObject(usersIds, usersData);

  const server = makeServer(log, usersById);
  server.listen(port, callback.bind(null, server));
};
