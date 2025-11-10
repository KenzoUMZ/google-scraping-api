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
        // Extrai título e URL do link principal
        // Bing usa: <h2><a target="_blank" href="...">título</a></h2>
        const linkMatch = /<h2[^>]*>[\s\S]*?<a[^>]+target="_blank"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(
            block,
        );

        if (!linkMatch) {
            return null;
        }

        const url = this.cleanUrl(linkMatch[1]);
        const title = this.cleanText(linkMatch[2]);

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
            .trim();
    }

    /**
     * Limpa e valida URL
     */
    private static cleanUrl(url: string): string {
        return url.trim();
    }
}
