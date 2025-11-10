import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ScrapeResultDto {
    @ApiProperty({ example: 'NestJS Tutorial - Official Docs' })
    title: string;

    @ApiPropertyOptional({ example: 'https://docs.nestjs.com/' })
    url?: string | null;
}

export class ScrapeResponseDto {
    @ApiProperty({
        description: 'Search term used',
        example: 'NestJS tutorial',
    })
    searchTerm: string;

    @ApiProperty({
        description: 'Array of search results with title and url',
        type: [ScrapeResultDto],
    })
    results: ScrapeResultDto[];
}

export interface GoogleResultDto {
    title: string;
    url: string | null;
}