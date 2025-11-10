// Centralized search engine related configuration

export const SEARCH_ENGINE_BASE_URL: string =
  process.env.SEARCH_ENGINE_BASE_URL ?? 'https://www.bing.com';

export const SEARCH_ENGINE_RESULT_ITEM_CLASS: string =
  process.env.SEARCH_ENGINE_RESULT_ITEM_CLASS ?? 'b_algo';

export const SEARCH_ENGINE_DEFAULT_COUNT: number = parseInt(
  process.env.SEARCH_ENGINE_DEFAULT_COUNT ?? '10',
  10,
);

export const SEARCH_ENGINE_QUERY_PARAM: string =
  process.env.SEARCH_ENGINE_QUERY_PARAM ?? 'q';

export const SEARCH_ENGINE_COUNT_PARAM: string =
  process.env.SEARCH_ENGINE_COUNT_PARAM ?? 'count';

// Hostname derivado da BASE_URL para comparações/domínio
export const SEARCH_ENGINE_HOSTNAME: string = (() => {
  try {
    return new URL(SEARCH_ENGINE_BASE_URL).hostname;
  } catch {
    return 'www.bing.com';
  }
})();
