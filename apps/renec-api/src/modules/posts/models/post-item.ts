import { ApiPropertyOptional, IsOptional, IsPositive } from '@joktec/core';
import { modelOptions, prop } from '@joktec/mongo';
import { IsCdnUrl } from '../../../utils';

@modelOptions({ schemaOptions: { _id: false, timestamps: false } })
export class PostItem {
  @prop({ default: '' })
  @IsOptional()
  @ApiPropertyOptional()
  content?: string;

  @prop({ default: '' })
  @IsOptional()
  @IsCdnUrl({ message: 'LINK_INVALID' })
  @ApiPropertyOptional()
  image?: string;

  @prop({ default: 0 })
  @IsOptional()
  @IsPositive({ message: 'ORDER_INVALID' })
  @ApiPropertyOptional()
  order?: number;
}
