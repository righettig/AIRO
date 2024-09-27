import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from './services/config.service';
import { NotificationsService } from './services/notifications.service';
import { UiNotificationRepository } from './services/notifications-repository.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'notifications-exchange',
          type: 'direct',
        },
      ],
      uri: process.env.RABBITMQ_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
  providers: [
    NotificationsService, 
    ConfigService,
    UiNotificationRepository
  ]
})
export class NotificationsModule {}
