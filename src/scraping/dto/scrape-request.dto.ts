import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ScrapeRequestDto {
  @ApiProperty({
    description: 'Search term to query on Bing',
    example: 'NestJS tutorial',
  })
  @IsString()
  @IsNotEmpty({ message: 'Search term cannot be empty' })
  searchTerm: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
