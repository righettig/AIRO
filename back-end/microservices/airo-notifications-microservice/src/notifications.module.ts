import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { NotificationsService } from './notifications.service';
import { EventsService } from './events/events.service';
import { ProfileService } from './profile/profile.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
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
          name: 'event-subscriptions-exchange',
          type: 'direct',
        }
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [
    NotificationsService, 
    EmailService, 
    EventsService,
    ProfileService
  ]  
})
export class NotificationsModule {}
