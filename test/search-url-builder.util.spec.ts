import {
  SEARCH_ENGINE_BASE_URL,
  SEARCH_ENGINE_COUNT_PARAM,
  SEARCH_ENGINE_DEFAULT_COUNT,
  SEARCH_ENGINE_QUERY_PARAM,
} from '../src/config';
import { SearchUrlBuilder } from '../src/scraping/utils/search-url-builder.util';

describe('SearchUrlBuilder', () => {
  it('should build URL with default count', () => {
    const url = SearchUrlBuilder.buildUrl('nest js');
    const u = new URL(url);
    expect(u.origin).toBe(new URL(SEARCH_ENGINE_BASE_URL).origin);
  // searchParams.get returns the decoded value
  expect(u.searchParams.get(SEARCH_ENGINE_QUERY_PARAM)).toBe('nest js');
    expect(u.searchParams.get(SEARCH_ENGINE_COUNT_PARAM)).toBe(
      String(SEARCH_ENGINE_DEFAULT_COUNT),
    );
  });

  it('should build URL with custom count', () => {
    const url = SearchUrlBuilder.buildUrl('nestjs', 25);
    const u = new URL(url);
    expect(u.searchParams.get(SEARCH_ENGINE_COUNT_PARAM)).toBe('25');
  });

  it('should handle special characters correctly', () => {
    const url = SearchUrlBuilder.buildUrl('C++ programming & tutorials');
    const u = new URL(url);
    expect(u.searchParams.get(SEARCH_ENGINE_QUERY_PARAM)).toBe(
      'C++ programming & tutorials',
    );
  });

  it('should preserve accented characters', () => {
    const url = SearchUrlBuilder.buildUrl('programação em português');
    const u = new URL(url);
    expect(u.searchParams.get(SEARCH_ENGINE_QUERY_PARAM)).toBe(
      'programação em português',
    );
  });

  it('should handle multiple spaces and preserve them', () => {
    const url = SearchUrlBuilder.buildUrl('nest  js   framework');
    const u = new URL(url);
    expect(u.searchParams.get(SEARCH_ENGINE_QUERY_PARAM)).toBe(
      'nest  js   framework',
    );
  });

  it('should handle quotes and symbols', () => {
    const url = SearchUrlBuilder.buildUrl('"exact match" search');
    const u = new URL(url);
    expect(u.searchParams.get(SEARCH_ENGINE_QUERY_PARAM)).toBe(
      '"exact match" search',
    );
  });

  it('should handle URL-like strings in search term', () => {
    const url = SearchUrlBuilder.buildUrl('site:github.com nestjs');
    const u = new URL(url);
    expect(u.searchParams.get(SEARCH_ENGINE_QUERY_PARAM)).toBe(
      'site:github.com nestjs',
    );
  });

  it('should throw error for empty search term', () => {
    expect(() => SearchUrlBuilder.buildUrl('')).toThrow(
      'Search term cannot be empty',
    );
  });

  it('should throw error for whitespace-only search term', () => {
    expect(() => SearchUrlBuilder.buildUrl('   ')).toThrow(
      'Search term cannot be empty',
    );
  });
});
