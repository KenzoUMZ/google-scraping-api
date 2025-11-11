import {
  SEARCH_ENGINE_BASE_URL,
  SEARCH_ENGINE_COUNT_PARAM,
  SEARCH_ENGINE_DEFAULT_COUNT,
  SEARCH_ENGINE_QUERY_PARAM,
} from '../../config';

/**
 * Construtor de URLs de busca para diferentes motores de busca
 */
export class SearchUrlBuilder {
  /**
   * Constrói URL de busca com base nas configurações
   * @param searchTerm Termo de busca
   * @param count Número de resultados (opcional)
   * @returns URL completa formatada
   */
  static buildUrl(
    searchTerm: string,
    count = SEARCH_ENGINE_DEFAULT_COUNT,
  ): string {
    // Valida que o termo não está vazio
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw new Error('Search term cannot be empty');
    }

    const url = new URL(SEARCH_ENGINE_BASE_URL);
    // Se a base vier sem caminho, mantemos '/', caso inclua já um caminho, respeitamos
    const hasPath = url.pathname && url.pathname !== '/';
    const searchPath = hasPath ? url.pathname : '/search';

    // Monta URL final - URLSearchParams lida com a codificação automaticamente
    const full = new URL(searchPath, url.origin);
    full.searchParams.set(SEARCH_ENGINE_QUERY_PARAM, searchTerm);
    full.searchParams.set(SEARCH_ENGINE_COUNT_PARAM, String(count));
    return full.toString();
  }
}
