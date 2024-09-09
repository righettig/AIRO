import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';

@Controller()
export class NotificationsController {
    private logger = new Logger('NotificationsController');

    constructor(private readonly emailService: EmailService) { }

    @MessagePattern('user.created')
    async executeAction(email: string) {
        this.logger.log('user.created: ', email);

        await this.emailService.sendEmail(
            email, 
            "AIRO new account", 
            "Welcome to AIRO!", 
            `Welcome to AIRO <strong>${email}</strong>. Head over to <a href="www.airo.ai">AIRO</a> and complete your profile.`
        );
    }
}
