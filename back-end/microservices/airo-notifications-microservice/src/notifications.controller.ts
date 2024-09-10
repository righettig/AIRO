import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { EmailService } from './email/email.service';

@Controller()
export class NotificationsController {
    private readonly logger = new Logger(NotificationsController.name);

    constructor(private readonly emailService: EmailService) { }

    @EventPattern('user.created')
    async executeAction(email: string) {
        this.logger.log('user.created: ', email);

        await this.emailService.sendEmail(
            email, 
            "AIRO new account", 
            "Welcome to AIRO!", 
            `Welcome to AIRO <strong>${email}</strong>. Head over to <a href="www.airo.ai">AIRO</a> and complete your profile.`
        );
    }

    @EventPattern('invoice.created')
    async invoice(data: any) {
        this.logger.log('invoice.created: ', data);

        // await this.emailService.sendEmail(
        //     email, 
        //     "AIRO invoice", 
        //     "Your payment was successful!", 
        //     `You have been invoiced <strong>100</strong>. Have fun with AIRO!.`
        // );
    }
}
