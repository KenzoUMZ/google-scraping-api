import { GoogleResultDto } from '../dto/scrape-response.dto';

/**
 * Parser especializado para extrair resultados de busca do Bing
 */
export class BingHtmlParser {
    /**
     * Extrai todos os resultados orgânicos da página de busca do Bing
     * @param html HTML completo da página de resultados
     * @returns Array de resultados extraídos
     */
    static extractResults(html: string): GoogleResultDto[] {
        const results: GoogleResultDto[] = [];

        // Tenta extrair resultados usando o método principal
        const mainResults = this.extractFromResultBlocks(html);
        
        if (mainResults.length > 0) {
            return mainResults;
        }

        // Fallback: tenta método alternativo se não encontrar nada
        return this.extractFromHeaders(html);
    }

    /**
     * Método principal: extrai resultados dos blocos <li class="b_algo">
     */
    private static extractFromResultBlocks(html: string): GoogleResultDto[] {
        const results: GoogleResultDto[] = [];
        
        // Bing estrutura cada resultado em <li class="b_algo">
        const resultBlockRegex = /<li[^>]*class="[^"]*b_algo[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;

        let blockMatch: RegExpExecArray | null;
        while ((blockMatch = resultBlockRegex.exec(html)) !== null) {
            const block = blockMatch[1];
            const result = this.parseResultBlock(block);
            
            if (result) {
                results.push(result);
            }
        }

        return results;
    }

    /**
     * Parse de um bloco individual de resultado
     */
    private static parseResultBlock(block: string): GoogleResultDto | null {
        // Extrai título do link principal
        // Bing usa: <h2><a target="_blank" href="...">título</a></h2>
        const linkMatch = /<h2[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(
            block,
        );

        if (!linkMatch) {
            return null;
        }

        let url = this.cleanUrl(linkMatch[1]);
        const title = this.cleanText(linkMatch[2]);

        // Se não conseguiu extrair a URL real do redirect, tenta buscar no atributo data-url ou cite
        if (!url || url.includes('bing.com')) {
            // Tenta extrair do elemento <cite> que geralmente contém a URL exibida
            const citeMatch = /<cite[^>]*>([\s\S]*?)<\/cite>/i.exec(block);
            if (citeMatch) {
                const citeUrl = this.cleanText(citeMatch[1]);
                // Adiciona protocolo se necessário
                if (citeUrl && !citeUrl.startsWith('http')) {
                    url = 'https://' + citeUrl;
                } else if (citeUrl) {
                    url = citeUrl;
                }
            }
        }

        // Valida que temos título e URL válidos
        if (!title || !url || !url.startsWith('http')) {
            return null;
        }

        return { title, url };
    }

    /**
     * Método fallback: extrai títulos de tags <h2>
     */
    private static extractFromHeaders(html: string): GoogleResultDto[] {
        const results: GoogleResultDto[] = [];
        const h2Regex = /<h2[^>]*>[\s\S]*?<a[^>]+>([\s\S]*?)<\/a>/gi;

        let match: RegExpExecArray | null;
        while ((match = h2Regex.exec(html)) !== null) {
            const title = this.cleanText(match[1]);
            
            if (title) {
                results.push({ title, url: null });
            }
        }

        return results;
    }

    /**
     * Remove tags HTML e limpa texto
     */
    private static cleanText(html: string): string {
        return html
            .replace(/<[^>]+>/g, '') // Remove tags HTML
            .replace(/\s+/g, ' ') // Normaliza espaços
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&') // Deve ser o último
            .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
            .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
            .trim();
    }

    /**
     * Limpa e valida URL, extraindo a URL real de redirects do Bing
     */
    private static cleanUrl(url: string): string {
        url = url.trim();
        
        // Se a URL é do Bing (redirect), extrai a URL real
        if (url.includes('bing.com')) {
            try {
                const urlObj = new URL(url);
                
                // Tenta extrair do parâmetro 'u' (comum em redirects do Bing)
                const uParam = urlObj.searchParams.get('u');
                if (uParam) {
                    // O parâmetro 'u' pode estar em base64 ou encoded
                    try {
                        // Tenta decodificar se estiver em formato especial
                        const decoded = decodeURIComponent(uParam);
                        if (decoded.startsWith('http')) {
                            return decoded;
                        }
                    } catch {
                        // Se falhar, retorna o parâmetro como está
                        if (uParam.startsWith('http')) {
                            return uParam;
                        }
                    }
                }
                
                // Tenta outros parâmetros comuns
                const urlParam = urlObj.searchParams.get('url');
                if (urlParam && urlParam.startsWith('http')) {
                    return decodeURIComponent(urlParam);
                }
                
                const qParam = urlObj.searchParams.get('q');
                if (qParam && qParam.startsWith('http')) {
                    return decodeURIComponent(qParam);
                }
            } catch {
                // Se falhar o parsing, retorna a URL original
            }
        }
        
        return url;
    }
}
