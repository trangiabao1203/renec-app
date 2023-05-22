import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { OtpModule } from '../../otpLogs';
import { SessionModule } from '../../sessions';
import { UserModule } from '../../users';
import { CoreModule, JwtModule } from '@joktec/core';
import { MongoModule } from '@joktec/mongo';

describe('AuthService class', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule, MongoModule, JwtModule, OtpModule, SessionModule, UserModule],
      providers: [AuthService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  // Additional tests for service methods
});
