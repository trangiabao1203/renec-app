import { isEmail, isMobilePhone } from '@joktec/core';
import { index, modelOptions, MongoSchema, prop } from '@joktec/mongo';
import { OTPStatus, OTPType } from './otp.enum';
import moment from 'moment';

@index({ fullName: 'text', phone: 'text', email: 'text' })
@modelOptions({ schemaOptions: { collection: 'otpLogs' } })
export class Otp extends MongoSchema {
  @prop({ required: true, validate: (v: string) => isMobilePhone(v, 'vi-VN') })
  phone!: string;

  @prop({ validate: isEmail })
  email?: string;

  @prop({ required: true })
  publicCode!: string;

  @prop({ required: true })
  privateCode!: string;

  @prop({ required: false, default: null })
  activeCode!: string;

  @prop({ required: true, enum: OTPType })
  type!: OTPType;

  @prop({ required: true, enum: OTPStatus })
  status!: OTPStatus;

  @prop({ required: true, default: moment().startOf('ms').add(30, 'second').toDate() })
  expired!: Date;

  @prop({ required: true, default: 30, min: 0 })
  expiredInSeconds!: number;

  @prop({ required: true, default: 1, min: 1, max: 5 })
  retry!: number;
}
