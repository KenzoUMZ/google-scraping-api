// Centralized HTTP-related configuration and defaults

export const HTTP_DEFAULT_TIMEOUT: number = parseInt(
  process.env.HTTP_DEFAULT_TIMEOUT ?? '15000',
  10,
);

export const HTTP_MAX_REDIRECTS: number = parseInt(
  process.env.HTTP_MAX_REDIRECTS ?? '5',
  10,
);

// Allow overriding specific headers via env if needed
const ENV_USER_AGENT = process.env.HTTP_USER_AGENT;
const ENV_ACCEPT_LANGUAGE = process.env.HTTP_ACCEPT_LANGUAGE;
const ENV_REFERER = process.env.HTTP_REFERER;

export const HTTP_DEFAULT_HEADERS: Record<string, string> = {
  'User-Agent':
    ENV_USER_AGENT ??
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': ENV_ACCEPT_LANGUAGE ?? 'en-US,en;q=0.9',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  Referer: ENV_REFERER ?? 'https://www.bing.com/',
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
