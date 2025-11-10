import { Injectable } from '@nestjs/common';
import { CaptchaResponseDto } from './dto/captcha-response.dto';
import { ScrapeRequestDto } from './dto/scrape-request.dto';
import { ScrapeResponseDto } from './dto/scrape-response.dto';
import {
    BingHtmlParser,
    CaptchaDetector,
    HttpClient,
    SearchUrlBuilder,
} from './utils';

/**
 * Service principal para scraping de resultados de busca
 * Coordena o uso de utilitários especializados para cada etapa
 */
@Injectable()
export class ScrapingService {
    /**
     * Realiza scraping dos resultados de busca do Bing
     * @param dto DTO com termo de busca e opções
     * @returns Resultados da busca ou indicador de CAPTCHA
     */
    async scrapeBingResults(
        dto: ScrapeRequestDto,
    ): Promise<ScrapeResponseDto | CaptchaResponseDto> {
        const { searchTerm } = dto;

        // 1. Constrói URL de busca
        const url = SearchUrlBuilder.buildBingUrl(searchTerm);

        // 2. Faz requisição HTTP
        const html = await HttpClient.fetchHtml(url);

        // 3. Verifica se há CAPTCHA/bloqueio
        if (CaptchaDetector.detect(html)) {
            return this.createCaptchaResponse();
        }

        // 4. Extrai resultados do HTML
        const results = BingHtmlParser.extractResults(html);

        // 5. Retorna resposta formatada
        return {
            searchTerm,
            results,
        };
    }

    /**
     * Cria resposta padrão quando CAPTCHA é detectado
     */
    private createCaptchaResponse(): CaptchaResponseDto {
        return {
            id: '', // UUID pode ser adicionado aqui se necessário
            captcha: true,
            message:
                'CAPTCHA detected. Please resolve manually in browser and retry.',
        };
    }
}
