import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../auth.module';
import { CoreModule, JwtModule } from '@joktec/core';
import { MongoModule } from '@joktec/mongo';

describe('AuthModule', () => {
  let authModule: AuthModule;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule, MongoModule, JwtModule, AuthModule],
    }).compile();

    authModule = moduleRef.get<AuthModule>(AuthModule);
  });

  it('should be defined', () => {
    expect(authModule).toBeDefined();
  });
});
