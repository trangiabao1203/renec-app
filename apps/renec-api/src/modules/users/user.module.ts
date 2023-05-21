import { Module } from '@joktec/core';
import { UserController } from './user.controller';
import { UserRepo } from './user.repo';
import { UserService } from './user.service';
import { UserBlockInterceptor, UserDenyInterceptor, UserGrantInterceptor, UserMasterInterceptor } from './hooks';

@Module({
  controllers: [UserController],
  providers: [
    UserRepo,
    UserService,
    UserMasterInterceptor,
    UserGrantInterceptor,
    UserDenyInterceptor,
    UserBlockInterceptor,
  ],
  exports: [UserService],
})
export class UserModule {}
