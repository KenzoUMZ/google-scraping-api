import { Injectable } from '@nestjs/common';
import { ScrapeRequestDto } from './dto/scrape-request.dto';
import { ScrapeResponseDto } from './dto/scrape-response.dto';
import { HtmlParser, HttpClient, SearchUrlBuilder } from './utils';

@Injectable()
export class ScrapingService {
  async scrapeBingResults(dto: ScrapeRequestDto): Promise<ScrapeResponseDto> {
    const { searchTerm, limit } = dto;

    // Usa o limit do DTO se fornecido, caso contrário usa o padrão
    const url = SearchUrlBuilder.buildUrl(searchTerm, limit);
    const html = await HttpClient.fetchHtml(url, 5);

    const results = HtmlParser.extractResults(html);

    return {
      searchTerm,
      results,
    };
  }
}
