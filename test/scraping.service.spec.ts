import { ScrapeRequestDto } from '../src/scraping/dto/scrape-request.dto';
import { ScrapingService } from '../src/scraping/scraping.service';
import { HtmlParser, HttpClient, SearchUrlBuilder } from '../src/scraping/utils';

describe('ScrapingService', () => {
    let service: ScrapingService;

    beforeEach(() => {
        jest.restoreAllMocks();
        service = new ScrapingService();
    });

    it('should build URL, fetch HTML and parse results', async () => {
        const dto: ScrapeRequestDto = { searchTerm: 'nestjs tutorial', limit: 5 };

        const builtUrl = 'https://www.bing.com/search?q=nestjs+tutorial&count=5';
        const html = '<html></html>';
        const parsed = [
            { title: 'NestJS - Official Docs', url: 'https://docs.nestjs.com/' },
        ];

        const urlSpy = jest
            .spyOn(SearchUrlBuilder, 'buildUrl')
            .mockReturnValue(builtUrl);
        const fetchSpy = jest
            .spyOn(HttpClient, 'fetchHtml')
            .mockResolvedValue(html);
        const parseSpy = jest
            .spyOn(HtmlParser, 'extractResults')
            .mockReturnValue(parsed);

        const result = await service.scrapeBingResults(dto);

        expect(urlSpy).toHaveBeenCalledWith('nestjs tutorial', 5);
        // The service currently forces redirectsLeft=5
        expect(fetchSpy).toHaveBeenCalledWith(builtUrl, 5);
        expect(parseSpy).toHaveBeenCalledWith(html);

        expect(result).toEqual({ searchTerm: 'nestjs tutorial', results: parsed });
    });

    it('should use default count when limit is not provided', async () => {
        const dto: ScrapeRequestDto = { searchTerm: 'typescript guide' };

        const builtUrl = 'https://www.bing.com/search?q=typescript+guide';
        const html = '<html></html>';
        const parsed = [{ title: 'TypeScript Docs', url: 'https://typescriptlang.org/' }];

        const urlSpy = jest
            .spyOn(SearchUrlBuilder, 'buildUrl')
            .mockReturnValue(builtUrl);
        jest.spyOn(HttpClient, 'fetchHtml').mockResolvedValue(html);
        jest.spyOn(HtmlParser, 'extractResults').mockReturnValue(parsed);

        const result = await service.scrapeBingResults(dto);

        // Should be called with searchTerm and undefined for limit (will use default)
        expect(urlSpy).toHaveBeenCalledWith('typescript guide', undefined);
        expect(result.searchTerm).toBe('typescript guide');
    });
});
