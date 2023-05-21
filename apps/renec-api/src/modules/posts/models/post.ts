import {
  ApiProperty,
  ApiPropertyOptional,
  Expose,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@joktec/core';
import { index, modelOptions, MongoSchema, prop, PropType, Ref } from '@joktec/mongo';
import { PostDisplay, PostStatus, PostType } from './post.enum';
import { PostItem } from './post-item';
import { IsCdnUrl } from '../../../utils';
import { User } from 'src/modules/users';

@index({ title: 'text', subhead: 'text' })
@modelOptions({ schemaOptions: { collection: 'videos' } })
export class Post extends MongoSchema {
  @prop({ required: true })
  @IsNotEmpty({ message: 'TITLE_REQUIRED' })
  @ApiProperty({ example: 'Passport' })
  title!: string;

  @prop({ default: '' })
  @IsOptional()
  @ApiPropertyOptional()
  subhead?: string;

  @prop({ default: '' })
  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @prop({ type: PostItem, default: [] }, PropType.ARRAY)
  @IsNotEmpty({ message: 'POST_ITEM_REQUIRED' })
  @IsArray({ message: 'POST_ITEM_INVALID' })
  @ValidateNested({ each: true })
  @ApiPropertyOptional({ type: PostItem, isArray: true })
  items: PostItem[] = [];

  @prop({ required: true, enum: PostType })
  @IsNotEmpty({ message: 'POST_TYPE_REQUIRED' })
  @IsEnum(PostType, { message: 'POST_TYPE_INVALID' })
  @ApiProperty({ enum: PostType, example: PostType.NEWS })
  type: PostType = PostType.OTHER;

  @prop({ default: '' })
  @IsOptional()
  @IsCdnUrl({ message: 'LINK_INVALID' })
  @ApiPropertyOptional()
  link?: string;

  @prop({ default: '' })
  @IsOptional()
  @IsCdnUrl({ message: 'LINK_INVALID' })
  @ApiPropertyOptional()
  image?: string;

  @prop({ default: '' })
  @IsOptional()
  @IsCdnUrl({ message: 'LINK_INVALID' })
  @ApiPropertyOptional()
  thumbnail?: string;

  @prop({ required: true })
  @IsNotEmpty({ message: 'POST_PUBLISHED_DATE_REQUIRED' })
  @IsDate({ message: 'POST_PUBLISHED_DATE_INVALID' })
  @ApiProperty()
  publishedDate: Date = new Date();

  @prop({ default: null })
  @IsOptional()
  @IsDate({ message: 'POST_EXPIRED_DATE_INVALID' })
  @ApiPropertyOptional()
  expiredDate?: Date;

  @prop({ required: true, enum: PostDisplay })
  @IsNotEmpty({ message: 'POST_DISPLAY_REQUIRED' })
  @IsEnum(PostDisplay, { message: 'POST_DISPLAY_INVALID' })
  @ApiProperty({ enum: PostDisplay })
  display: PostDisplay = PostDisplay.LINK;

  @prop({ ref: () => User, default: [] }, PropType.ARRAY)
  @Type(() => String)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  likeByIds?: Ref<User, string>[] = [];

  @prop({ ref: () => User, default: [] }, PropType.ARRAY)
  @Type(() => String)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  dislikeByIds?: Ref<User, string>[] = [];

  @prop({ required: true, enum: PostStatus })
  @IsNotEmpty({ message: 'POST_STATUS_REQUIRED' })
  @IsEnum(PostStatus, { message: 'POST_STATUS_INVALID' })
  @ApiProperty({ enum: PostStatus })
  status: PostStatus = PostStatus.ACTIVATED;

  @prop({ ref: () => User, foreignField: '_id', localField: 'createdBy', justOne: true })
  @Type(() => User)
  @ApiPropertyOptional({ type: User })
  author?: Ref<User>;
}
