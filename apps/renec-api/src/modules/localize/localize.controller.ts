import {
  ApiBody,
  ApiExcludeController,
  ApiOperation,
  ApiTags,
  Body,
  Controller,
  Get,
  Post,
  QueryParam,
} from '@joktec/core';
import { LocalizeService } from './localize.service';

@Controller('localize')
@ApiTags('localize')
@ApiExcludeController()
export class LocalizeController {
  constructor(private localizeService: LocalizeService) {}

  @Get('/')
  @ApiOperation({ summary: 'List localizes' })
  async getAll(@QueryParam('type') type: string): Promise<any> {
    return this.localizeService.getTranslate(type);
  }

  @Post('/')
  @ApiOperation({ summary: 'Update localizes' })
  @ApiBody({ type: Object })
  async updateTranslate(@Body() body: any): Promise<any> {
    return this.localizeService.updateTranslate();
  }
}
