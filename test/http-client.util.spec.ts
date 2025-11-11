import { BadRequestException } from '@nestjs/common';
import * as http from 'http';
import { HttpClient } from '../src/scraping/utils/http-client.util';

describe('HttpClient', () => {
  it('should reject when redirects exceed limit', async () => {
    await expect(
      HttpClient.fetchHtml('http://localhost', -1),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  describe('with local server', () => {
    let server: http.Server;
    let port: number;

    beforeAll(async () => {
      server = http.createServer((req, res) => {
        if (req.url === '/redirect') {
          res.statusCode = 302;
          res.setHeader('Location', '/final');
          res.end();
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body>ok</body></html>');
      });

      await new Promise<void>((resolve) => {
        server.listen(0, '127.0.0.1', () => {
          const address = server.address();
          if (typeof address === 'object' && address) {
            port = address.port;
          } else {
            port = 0;
          }
          resolve();
        });
      });
    });

    afterAll(async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    });

    it('should fetch plain html', async () => {
      const html = await HttpClient.fetchHtml(
        `http://127.0.0.1:${port}/test`,
        1,
        {
          timeoutMs: 3000,
        },
      );
      expect(html).toContain('ok');
    });

    it('should follow redirect', async () => {
      const html = await HttpClient.fetchHtml(
        `http://127.0.0.1:${port}/redirect`,
        2,
        {
          timeoutMs: 3000,
        },
      );
      expect(html).toContain('ok');
    });
  });
});
