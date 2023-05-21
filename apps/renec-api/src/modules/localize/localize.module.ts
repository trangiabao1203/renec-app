import { Global, Module } from '@joktec/core';
import { LocalizeController } from './localize.controller';
import { LocalizeService } from './localize.service';

@Global()
@Module({
  controllers: [LocalizeController],
  providers: [LocalizeService],
  exports: [LocalizeService],
})
export class LocalizeModule {}
