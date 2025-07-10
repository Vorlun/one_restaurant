import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BaseAuthService } from './base-auth.service';
import { UserAuthService } from './user-auth.service';
import { UserAuthController } from './user-auth.controller';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [JwtModule.register({}), UsersModule, MailModule],
  providers: [BaseAuthService, UserAuthService],
  controllers: [UserAuthController],
  exports:[JwtModule]
})
export class AuthModule {}
