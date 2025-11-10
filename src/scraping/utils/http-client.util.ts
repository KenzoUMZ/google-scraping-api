import { BadRequestException } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';
import * as zlib from 'zlib';

/**
 * Cliente HTTP customizado para fazer requests com suporte a:
 * - Redirects automáticos
 * - Descompressão de conteúdo (gzip, deflate, brotli)
 * - Headers customizados para evitar detecção de bot
 */
export class HttpClient {
    /**
     * Faz uma requisição HTTP/HTTPS e retorna o HTML descomprimido
     * @param url URL completa para fazer o request
     * @param redirectsLeft Número máximo de redirects a seguir
     * @returns Promise com o HTML da página
     */
    static async fetchHtml(url: string, redirectsLeft = 5): Promise<string> {
        return new Promise((resolve, reject) => {
            if (redirectsLeft < 0) {
                return reject(new BadRequestException('Too many redirects'));
            }

            const options = {
                headers: this.getDefaultHeaders(),
                timeout: 15000,
            };

            const lib = url.startsWith('https') ? https : http;

            const req = lib.get(url, options, (res: any) => {
                // Trata redirects (3xx)
                if (
                    res.statusCode >= 300 &&
                    res.statusCode < 400 &&
                    res.headers?.location
                ) {
                    const nextUrl = new URL(res.headers.location, url).toString();
                    return resolve(this.fetchHtml(nextUrl, redirectsLeft - 1));
                }

                // Configura stream de descompressão se necessário
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

    /**
     * Retorna headers padrão para simular um navegador real
     */
    private static getDefaultHeaders(): Record<string, string> {
        return {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            Referer: 'https://www.bing.com/',
            'Cache-Control': 'no-cache',
            'Sec-Ch-Ua':
                '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
        };
    }

    /**
     * Cria um stream de descompressão baseado no encoding da resposta
     */
    private static createDecompressionStream(response: any): any {
        const encoding = response.headers['content-encoding'];

        if (encoding === 'gzip') {
            return response.pipe(zlib.createGunzip());
        } else if (encoding === 'deflate') {
            return response.pipe(zlib.createInflate());
        } else if (encoding === 'br') {
            return response.pipe(zlib.createBrotliDecompress());
        }

        // Sem compressão
        return response;
    }
}
