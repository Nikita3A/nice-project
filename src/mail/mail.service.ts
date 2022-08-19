import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserEmailConfirmation  } from '../users/interfaces/user.interface';


@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private cfg: ConfigService
  ) {}

  async sendUserConfirmation(user: UserEmailConfirmation, token: string) {
    const url = `http://${this.cfg.get('SERVER_HOST')}:${this.cfg.get('PORT')}/api/auth/users/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', 
      context: { 
        name: user.name,
        url,
      },
    })
    .catch((err) => {
      console.log(err);
    });
    return url;
  }

  async sendLinkToResetPassword(user: User, token: string) {
    const url = `https://${this.cfg.get('SERVER_HOST')}/auth/user/resetPassword?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Hello! Here link to reset password',
      template: './confirmation', 
      context: { 
        name: user.name,
        url,
      },
    })
    .catch((err) => {
      console.log(err);
    });
    return url;
  }
}
