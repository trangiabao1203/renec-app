import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
  Exclude,
  IsDate,
  IsEmail,
  isEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  Type,
  ValidateNested,
} from '@joktec/core';
import { index, modelOptions, MongoSchema, prop } from '@joktec/mongo';
import { UserGender, UserRole, UserStatus } from './user.enum';
import moment from 'moment';
import { Address } from './address';
import { IsCdnUrl } from '../../../utils';

@index({ fullName: 'text', phone: 'text', email: 'text' })
@modelOptions({ schemaOptions: { collection: 'users' } })
export class User extends MongoSchema {
  @prop({ required: true })
  @IsNotEmpty({ message: 'FULL_NAME_REQUIRED' })
  @ApiProperty({ example: 'John Doe' })
  fullName!: string;

  @prop()
  @IsOptional()
  @IsMobilePhone('vi-VN', { strictMode: true }, { message: 'PHONE_INVALID' })
  @ApiProperty({ required: true })
  phone?: string;

  @prop({ required: true, trim: true, lowercase: true, validate: isEmail })
  @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @ApiPropertyOptional()
  email!: string;

  @prop({ trim: true, immutable: true })
  @IsOptional()
  @ApiPropertyOptional()
  phoneId?: string;

  @prop({ trim: true, immutable: true })
  @IsOptional()
  @ApiPropertyOptional()
  googleId?: string;

  @prop({ trim: true, immutable: true })
  @IsOptional()
  @ApiPropertyOptional()
  facebookId?: string;

  @prop({})
  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @ApiHideProperty()
  hashPassword?: string;

  @prop({})
  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @ApiHideProperty()
  apiKey?: string;

  @prop({ required: true, enum: UserRole, default: UserRole.USER })
  @IsNotEmpty({ message: 'USER_ROLE_REQUIRED' })
  @IsEnum(UserRole, { message: 'USER_ROLE_INVALID' })
  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @prop({ addNullToEnum: true, enum: UserGender, default: UserGender.UNKNOWN })
  @IsOptional()
  @IsEnum(UserGender, { message: 'GENDER_INVALID' })
  @ApiPropertyOptional({ enum: UserGender })
  gender?: UserGender;

  @prop({ default: moment().startOf('year').toDate() })
  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: 'BIRTHDAY_INVALID' })
  @ApiPropertyOptional()
  birthday?: Date;

  @prop({ type: Address, default: new Address() })
  @Type(() => Address)
  @IsOptional()
  @ValidateNested()
  @ApiPropertyOptional({ type: Address })
  address?: Address;

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

  @prop({ required: true, enum: UserStatus, default: UserStatus.PENDING })
  @IsNotEmpty({ message: 'STATUS_REQUIRED' })
  @IsEnum(UserStatus, { message: 'STATUS_INVALID' })
  @ApiProperty({ enum: UserStatus, example: UserStatus.PENDING })
  status!: UserStatus;

  @prop({ required: true, default: false })
  @Exclude({ toPlainOnly: true })
  isMaster!: boolean;
}
