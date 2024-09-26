import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'auth-exchange',
          type: 'direct',
        },
        {
          name: 'invoice-exchange',
          type: 'direct',
        },
        {
          name: 'notifications-exchange',
          type: 'direct',
        },
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [NotificationsService, EmailService]  
})
export class NotificationsModule {}
