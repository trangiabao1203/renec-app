import {
  hashPassword,
  Injectable,
  isStrongPassword,
  JwtPayload,
  matchPassword,
  ValidateBuilder,
  ValidateException,
} from '@joktec/core';
import { getGravatar, Gravatar, UserService } from '../users';
import { UserFcmDto, UserLogoutDto, UserPasswordDto, UserProfile, UserProfileDto } from './models';
import { SessionService, SessionStatus } from '../sessions';
import { OtpService } from '../otpLogs';
import { isEmpty } from 'lodash';
import { PASSWORD_OPTIONS } from '../../utils';

@Injectable()
export class ProfileService {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private otpService: OtpService,
  ) {}

  async getProfile(payload: JwtPayload): Promise<UserProfile> {
    return this.userService.findOne(payload.sub);
  }

  async updateProfile(input: UserProfileDto, payload: JwtPayload): Promise<UserProfile> {
    const user = await this.userService.findOne(payload.sub);

    const gravatar: Gravatar = await getGravatar(user.email);
    if (user.fullName === user.phone && !input.fullName) input.fullName = gravatar?.fullName || user.phone;
    if (!user.image && !input.image) input.image = gravatar?.photoUrl;
    if (!user.thumbnail && !input.thumbnail) input.thumbnail = gravatar?.thumbnailUrl;

    return this.userService.update(payload.sub, input, payload);
  }

  async changePassword(input: UserPasswordDto, payload: JwtPayload): Promise<UserProfile> {
    const user = await this.userService.findOne(payload.sub);

    const builder = ValidateBuilder.init();
    if (!matchPassword(input.oldPassword, user.hashPassword)) builder.add('oldPassword', 'OLD_PASSWORD_NOT_MATCH');
    if (input.password === input.oldPassword) builder.add('password', 'DUPLICATE_OLD_PASSWORD');
    if (!isStrongPassword(input.password, PASSWORD_OPTIONS)) builder.add('password', 'PASSWORD_WEEK');
    if (!input.confirmedPassword) builder.add('confirmedPassword', 'CONFIRMED_PASSWORD_REQUIRED');
    if (input.password !== input.confirmedPassword) builder.add('confirmedPassword', 'CONFIRMED_PASSWORD_NOT_MATCH');

    const validateError = builder.build();
    if (!isEmpty(validateError)) throw new ValidateException(validateError);

    return this.userService.update(user._id, { hashPassword: hashPassword(input.password) });
  }

  async updateRegistrationID(input: UserFcmDto, payload: JwtPayload): Promise<UserProfile> {
    const [user, session] = await Promise.all([
      this.userService.findOne(payload.sub),
      this.sessionService.findByTokenId(payload.jti),
    ]);
    await this.sessionService.update(session._id, { registrationId: input.registrationId });
    return user;
  }

  async revokedMe(payload: JwtPayload): Promise<UserLogoutDto> {
    const session = await this.sessionService.findByTokenId(payload.jti);
    if (session) {
      await this.sessionService.update(session._id, { status: SessionStatus.DISABLED, revokedAt: new Date() });
    }
    return { success: true };
  }

  async revokedOther(tokenIds: string[], payload: JwtPayload): Promise<UserLogoutDto> {
    const filterTokens = tokenIds.filter(jti => jti !== payload.jti);
    const sessions = await this.sessionService.find({ condition: { tokenId: { $in: filterTokens } } });
    if (sessions.length) {
      await Promise.all(
        sessions.map(session =>
          this.sessionService.update(session._id, { status: SessionStatus.DISABLED, revokedAt: new Date() }),
        ),
      );
    }
    return { success: true };
  }

  async deleteAccount(payload: JwtPayload): Promise<UserLogoutDto> {
    await Promise.all([
      this.otpService.deleteByPhone(payload.phone),
      this.sessionService.deleteByUserId(payload.sub),
      this.userService.forceDelete(payload.sub),
    ]);
    return { success: true };
  }
}
