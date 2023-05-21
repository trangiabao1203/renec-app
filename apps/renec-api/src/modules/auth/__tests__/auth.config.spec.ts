import { beforeEach, describe, expect, it } from '@jest/globals';
import { AuthConfig } from '../auth.config';

describe('AuthConfig', () => {
  let authConfig: AuthConfig;

  beforeEach(async () => {
    authConfig = new AuthConfig({});
  });

  it('should be defined', () => {
    expect(authConfig).toBeDefined();
  });
});
