import { Body, Controller, Post } from '@nestjs/common';
import { ScrapeRequestDto } from './dto/scrape-request.dto';
import { ScrapingService } from './scraping.service';

@Controller('scrape')
export class ScrapingController {
    constructor(private readonly svc: ScrapingService) { }

    @Post()
    async scrape(@Body() dto: ScrapeRequestDto) {
        return this.svc.scrapeBingResults(dto);
    }

}
