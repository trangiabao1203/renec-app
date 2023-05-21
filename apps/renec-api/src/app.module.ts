import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  CoreModule,
  JwtModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ResponseInterceptor,
  TrackInterceptor,
} from '@joktec/core';
import { MongoModule } from '@joktec/mongo';
import { NotifierModule } from '@joktec/notifier';
import { HttpModule } from '@joktec/http';
import { AuthMiddleware, HttpExceptionFilter, RoleGuard } from './base';
import { OtpModule } from './modules/otpLogs';
import { SessionController, SessionModule } from './modules/sessions';
import { UserController, UserModule } from './modules/users';
import { AuthModule } from './modules/auth';
import { ProfileController, ProfileModule } from './modules/profile';
import { PostController, PostModule } from './modules/posts';
import { HelperController, HelperModule } from './modules/helper';

@Module({
  imports: [
    // Libs
    CoreModule,
    MongoModule,
    NotifierModule,
    HttpModule,
    JwtModule,
    // Modules
    OtpModule,
    SessionModule,
    UserModule,
    AuthModule,
    ProfileModule,
    PostModule,
    HelperModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TrackInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_GUARD, useClass: RoleGuard },
    AuthMiddleware,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'posts', method: RequestMethod.GET })
      .forRoutes(
        UserController,
        ProfileController,
        PostController,
        SessionController,
        HelperController,
      );
  }
}
