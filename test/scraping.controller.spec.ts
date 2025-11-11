import { Test, TestingModule } from '@nestjs/testing';
import { ScrapeRequestDto } from '../src/scraping/dto/scrape-request.dto';
import { ScrapingController } from '../src/scraping/scraping.controller';
import { ScrapingService } from '../src/scraping/scraping.service';

describe('ScrapingController', () => {
  let controller: ScrapingController;
  let service: { scrapeBingResults: jest.Mock };

  beforeEach(async () => {
    const serviceMock: { scrapeBingResults: jest.Mock } = {
      scrapeBingResults: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapingController],
      providers: [{ provide: ScrapingService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ScrapingController>(ScrapingController);
    service = module.get<{ scrapeBingResults: jest.Mock }>(ScrapingService);
  });

  it('should delegate to service.scrapeBingResults', async () => {
    const dto: ScrapeRequestDto = { searchTerm: 'nestjs', limit: 3 };
    const payload = {
      searchTerm: 'nestjs',
      results: [{ title: 'NestJS', url: 'https://nestjs.com' }],
    };
    service.scrapeBingResults.mockResolvedValue(payload);

    const res = await controller.scrape(dto);

    expect(service.scrapeBingResults).toHaveBeenCalledWith(dto);
    expect(res).toEqual(payload);
  });
});
