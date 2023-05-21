import { Module } from '@joktec/core';
import { HelperController } from './helper.controller';
import { HelperService } from './helper.service';

@Module({
  controllers: [HelperController],
  providers: [HelperService],
})
export class HelperModule {}
