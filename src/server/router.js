import validateUser from '../userValidator.js';
import { getParams, nextId } from '../utils.js';

const router = {
  GET: {
    '/': (req, res, matches, body, users) => {
      const messages = ['Welcome to The Phonebook', `Records count: ${Object.keys(users).length}`];
      res.end(messages.join('\n'));
    },

    '/search.json': (req, res, matches, body, users) => {
      res.setHeader('Content-Type', 'application/json');

      const { q = '' } = getParams(req.url);
      const normalizedSearch = q.trim().toLowerCase();
      const ids = Object.keys(users);
      const usersSubset = ids
        .filter((id) => users[id].name.toLowerCase().includes(normalizedSearch))
        .map((id) => users[id]);
      res.end(JSON.stringify({ data: usersSubset }));
    },

    '/users.json': (req, res, matches, body, users) => {
      res.setHeader('Content-Type', 'application/json');

      const { page = 1, perPage = 10 } = getParams(req.url);
      const ids = Object.keys(users);

      const usersSubset = ids
        .slice(page * perPage - perPage, page * perPage)
        .map((id) => users[id]);
      const totalPages = Math.ceil(ids.length / perPage);
      res.end(
        JSON.stringify({
          meta: { page: Number(page), perPage: Number(perPage), totalPages },
          data: usersSubset,
        }),
      );
    },

    '/users/(\\d+).json': (req, res, matches, body, users) => {
      const id = matches[1];
      res.setHeader('Content-Type', 'application/json');
      const user = users[id];
      if (!user) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.end(JSON.stringify({ data: user }));
    },
  },
  POST: {
    '/users.json': (req, res, matches, body, users) => {
      res.setHeader('Content-Type', 'application/json');
      const id = nextId();
      const data = JSON.parse(body);
      const errors = validateUser(data);

      if (errors.length === 0) {
        res.writeHead(201);
        users[id] = data; // eslint-disable-line
        res.end(JSON.stringify({ meta: { location: `/users/${id}.json` }, data: { ...data, id } }));
      } else {
        res.writeHead(422);
        res.end(JSON.stringify({ errors }));
      }
    },
  },
};

export default router;
