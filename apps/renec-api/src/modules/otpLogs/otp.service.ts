import { BaseService, Injectable } from '@joktec/core';
import { OtpRepo } from './otp.repo';
import { Otp, OTPStatus, OTPType } from './models';
import moment from 'moment';

@Injectable()
export class OtpService extends BaseService<Otp, string> {
  constructor(protected otpRepo: OtpRepo) {
    super(otpRepo);
  }

  async findLastOtpByPhone(phone: string, type: OTPType): Promise<Otp[]> {
    return this.otpRepo.find({
      condition: {
        phone,
        type,
        createdAt: {
          $gte: moment().startOf('date').toDate(),
          $lte: moment().endOf('date').toDate(),
        },
        status: { $nin: [OTPStatus.DISABLED, OTPStatus.SUCCESS] },
      },
      sort: { createdAt: 'desc' },
    });
  }

  async findByPrivateCode(privateCode: string): Promise<Otp> {
    const results = await this.otpRepo.find({ condition: { privateCode } });
    return results[0];
  }

  async findByActiveCode(activeCode: string): Promise<Otp> {
    return this.otpRepo.findOne({ condition: { activeCode }, sort: { createdAt: 'desc' } });
  }

  async deleteByPhone(phone: string): Promise<number> {
    const opts = await this.otpRepo.find({ condition: { phone } });
    const res = await Promise.all(opts.map(o => this.otpRepo.delete({ _id: o._id }, { force: true })));
    return res.length;
  }
}
