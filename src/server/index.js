import http from 'http';
import url from 'url';
import router from './router.js';

export default (log, users) =>
  http.createServer((request, response) => {
    const body = [];

    log(`${request.method} ${request.url}`);

    request
      .on('error', (err) => log(err))
      .on('data', (chunk) => body.push(chunk.toString()))
      .on('end', () => {
        response.on('error', (err) => log(err));
        const routes = router[request.method];
        const result = Object.keys(routes).find((str) => {
          const { pathname } = url.parse(request.url);

          const regexp = new RegExp(`^${str}$`);
          const matches = pathname.match(regexp);

          if (!matches) return false;

          routes[str](request, response, matches, body, users, log);
          return true;
        });

        if (!result) {
          response.writeHead(404);
          response.end();
        }
      });
  });
