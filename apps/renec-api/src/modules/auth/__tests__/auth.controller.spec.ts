import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CoreModule, JwtModule } from '@joktec/core';
import { MongoModule } from '@joktec/mongo';
import { OtpModule } from '../../otpLogs';
import { SessionModule } from '../../sessions';
import { UserModule } from '../../users';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule, MongoModule, JwtModule, OtpModule, SessionModule, UserModule],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // Additional tests for controller actions
});
