import { ApiBody, ApiOkResponse, ApiOperation, ApiTags, Body, Controller, Post } from '@joktec/core';
import { HelperService } from './helper.service';
import { YoutubeRequest, YoutubeResponse } from './models';

@Controller('helper')
@ApiTags('helper')
export class HelperController {
  constructor(private helperService: HelperService) {}

  @Post('/youtube')
  @ApiOperation({ summary: 'Scrape Youtube info' })
  @ApiBody({ type: YoutubeRequest })
  @ApiOkResponse({ type: YoutubeResponse })
  async scrapeYoutube(@Body() input: YoutubeRequest): Promise<YoutubeResponse> {
    return this.helperService.scrapeYoutube(input.url);
  }
}
