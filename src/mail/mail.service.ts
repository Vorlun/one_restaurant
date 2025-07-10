import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationMail(user: User) {
    const url = `${process.env.API_URL}/api/auth/user/activate/${user.activation_link}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Verify your email address',
      template: 'confirmation',
      context: {
        username: user.full_name,
        url,
      },
    });
  }
}
