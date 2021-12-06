import axios from 'axios';
import server from '../src/index.js';

const hostname = 'localhost';
const port = 9000;
const base = `http://${hostname}:${port}`;

describe('Phonebook', () => {
  it('GET /', () =>
    new Promise((resolve, reject) => {
      server(port, async (s) => {
        try {
          const res = await axios.get(base);
          expect(res.data).toBe('Welcome to The Phonebook\nRecords count: 1000');
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    }));

  it('POST /users.json', () => {
    const result = {
      data: {
        id: 1001,
        name: 'Tom',
        phone: '1234-234-234',
      },
      meta: {
        location: '/users/1001.json',
      },
    };

    const data = {
      name: 'Tom',
      phone: '1234-234-234',
    };

    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        try {
          const url = new URL('/users.json', base);
          const res = await axios.post(url.toString(), data);
          expect(res.status).toBe(201);
          expect(res.data).toEqual(result);

          const url2 = new URL('/users/1001.json', base);
          const res2 = await axios.get(url2.toString());
          expect(res2.status).toBe(200);
          expect(res2.data).toEqual({ data });
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('POST /users.json (with errors)', () => {
    const result = {
      errors: [
        {
          source: 'name',
          title: "can't be blank",
        },
        {
          source: 'phone',
          title: "can't be blank",
        },
      ],
    };

    const data = {
      name: '',
      phone: '',
    };

    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        try {
          const url = new URL('/users.json', base);
          const res = await axios.post(url.toString(), data, { validateStatus: () => true });
          expect(res.status).toBe(422);
          res.data.errors.sort((a, b) => {
            if (a.source > b.source) return 1;
            if (a.source < b.source) return -1;
            return 0;
          });
          expect(res.data).toEqual(result);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('GET /users.json?perPage&page', () => {
    const result = {
      meta: { page: 3, perPage: 4, totalPages: 250 },
      data: [
        { name: 'Mrs. Marlee Lesch', phone: '(412) 979-7311' },
        { name: 'Mrs. Mabelle Cormier', phone: '307.095.4754' },
        { name: 'Kale Macejkovic', phone: '699-803-8578' },
        { name: 'Miss Verla West', phone: '(546) 173-8884' },
      ],
    };

    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        const url = new URL('/users.json', base);
        url.searchParams.set('perPage', 4);
        url.searchParams.set('page', 3);
        try {
          const res = await axios.get(url.toString());
          expect(res.headers['content-type']).toBe('application/json');
          expect(res.status).toBe(200);
          expect(res.data).toEqual(result);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('GET /users.json', () => {
    const result = {
      meta: { page: 1, perPage: 10, totalPages: 100 },
      data: [
        { name: 'Chelsie Eichmann', phone: '1-466-807-1978' },
        { name: 'Miss Ewald Dickinson', phone: '699-653-9379' },
        { name: 'Mauricio Cassin', phone: '(683) 115-8139' },
        { name: 'Liam Wiegand', phone: '1-327-988-3382' },
        { name: 'Lonny McGlynn', phone: '(935) 384-0149' },
        { name: 'Dr. Faustino Bailey', phone: '746-901-8330' },
        { name: 'Audrey Renner Sr.', phone: '(315) 168-5651' },
        { name: 'Odie Hettinger', phone: '498.168.4492' },
        { name: 'Mrs. Marlee Lesch', phone: '(412) 979-7311' },
        { name: 'Mrs. Mabelle Cormier', phone: '307.095.4754' },
      ],
    };

    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        const url = new URL('/users.json', base);
        try {
          const res = await axios.get(url.toString());
          expect(res.headers['content-type']).toBe('application/json');
          expect(res.status).toBe(200);
          expect(res.data).toEqual(result);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('GET /users/<id>', () => {
    const result = {
      data: {
        name: 'Mrs. Marlee Lesch',
        phone: '(412) 979-7311',
      },
    };

    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        try {
          const url = new URL('/users/9.json', base);
          const res = await axios.get(url.toString());
          expect(res.status).toBe(200);
          expect(res.data).toEqual(result);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('GET /users/<undefined>', () =>
    new Promise((resolve, reject) => {
      server(port, async (s) => {
        try {
          const url = new URL('/users/10000.json', base);
          const res = await axios.get(url.toString(), { validateStatus: () => true });
          expect(res.status).toBe(404);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    }));

  it('GET /search', () => {
    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        const url = new URL('/search.json', base);
        try {
          const res = await axios.get(url.toString());
          expect(res.data.data.length).toBe(1000);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('GET /search?q=<undefined>', () => {
    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        const url = new URL('/search.json', base);
        url.searchParams.set('q', 'AAsdf2');
        try {
          const res = await axios.get(url.toString());
          expect(res.data.data.length).toBe(0);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('GET /search?q=<substr> 2', () => {
    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        const url = new URL('/search.json', base);
        url.searchParams.set('q', 'LIANA');
        try {
          const res = await axios.get(url.toString());
          expect(res.data.data.length).toBe(2);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('Throw 404', () => {
    return new Promise((resolve, reject) => {
      server(port, async (s) => {
        const url = new URL('/undefined.json', base);
        try {
          await expect(axios.get(url.toString())).rejects.toThrow();
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          s.close();
        }
      });
    });
  });

  it('Without callback', async () => {
    expect(await server(port)).toBeUndefined();
  });
});
