import { BadRequestException } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';
import * as zlib from 'zlib';
import {
    HTTP_DEFAULT_HEADERS,
    HTTP_DEFAULT_TIMEOUT,
    HTTP_MAX_REDIRECTS,
} from '../../config';

export class HttpClient {
  static async fetchHtml(
    url: string,
    redirectsLeft = HTTP_MAX_REDIRECTS,
    opts: {
      legacy?: boolean;
      extraHeaders?: Record<string, string>;
      timeoutMs?: number;
    } = {},
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (redirectsLeft < 0) {
        return reject(new BadRequestException('Too many redirects'));
      }

      const baseHeaders = this.getDefaultHeaders();
      const composedHeaders = {
        ...baseHeaders,
        ...(opts.extraHeaders ?? {}),
      };

      const requestOptions = {
        headers: composedHeaders,
        timeout: opts.timeoutMs ?? HTTP_DEFAULT_TIMEOUT,
      };

      const lib: typeof https | typeof http = url.startsWith('https')
        ? https
        : http;

      const req = lib.get(url, requestOptions, (res: http.IncomingMessage) => {
        if (
          (res.statusCode ?? 0) >= 300 &&
          (res.statusCode ?? 0) < 400 &&
          res.headers?.location
        ) {
          const nextUrl = new URL(res.headers.location, url).toString();
          return resolve(this.fetchHtml(nextUrl, redirectsLeft - 1, opts));
        }

        const stream = this.createDecompressionStream(res);

        const chunks: Buffer[] = [];
        stream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        stream.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(
              new BadRequestException(
                `Request failed with status ${res.statusCode}`,
              ),
            );
          }
          const buffer = Buffer.concat(chunks);
          const data = buffer.toString('utf-8');
          resolve(data);
        });

        stream.on('error', (err: Error) => reject(err));
      });

      req.on('error', (err: Error) => reject(err));
      req.on('timeout', () => {
        req.destroy(new Error('Request timeout'));
      });
    });
  }

  private static getDefaultHeaders(): Record<string, string> {
    return HTTP_DEFAULT_HEADERS;
  }

  private static createDecompressionStream(
    response: http.IncomingMessage,
  ): NodeJS.ReadableStream {
    const encoding = response.headers['content-encoding'];

    if (encoding === 'gzip') {
      return response.pipe(zlib.createGunzip());
    } else if (encoding === 'deflate') {
      return response.pipe(zlib.createInflate());
    } else if (encoding === 'br') {
      return response.pipe(zlib.createBrotliDecompress());
    }

    return response;
  }
}
