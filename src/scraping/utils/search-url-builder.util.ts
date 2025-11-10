/**
 * Construtor de URLs de busca para diferentes motores de busca
 */
export class SearchUrlBuilder {
    /**
     * Constrói URL de busca do Bing
     * @param searchTerm Termo de busca
     * @param count Número de resultados (opcional)
     * @returns URL completa formatada
     */
    static buildBingUrl(searchTerm: string, count = 10): string {
        const encodedTerm = encodeURIComponent(searchTerm);
        return `https://www.bing.com/search?q=${encodedTerm}&count=${count}`;
    }

    /**
     * Constrói URL de busca do Google (para uso futuro)
     * @param searchTerm Termo de busca
     * @param num Número de resultados (opcional)
     * @returns URL completa formatada
     */
    static buildGoogleUrl(searchTerm: string, num = 10): string {
        const encodedTerm = encodeURIComponent(searchTerm);
        return `https://www.google.com/search?q=${encodedTerm}&num=${num}&hl=en&pws=0&gl=us`;
    }

    /**
     * Constrói URL de busca do DuckDuckGo (para uso futuro)
     * @param searchTerm Termo de busca
     * @returns URL completa formatada
     */
    static buildDuckDuckGoUrl(searchTerm: string): string {
        const encodedTerm = encodeURIComponent(searchTerm);
        return `https://duckduckgo.com/html/?q=${encodedTerm}`;
    }
}
