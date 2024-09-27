import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from './services/config.service';
import { NotificationsService } from './services/notifications.service';
import { UiNotificationRepository } from './services/notifications-repository.service';
import { UiNotificationStatusRepository } from './services/notifications-status.repository.service';
import { UiNotificationController } from './controllers/ui-notifications.controller';

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
  controllers: [
    UiNotificationController
  ],
  providers: [
    NotificationsService, 
    ConfigService,
    UiNotificationRepository,
    UiNotificationStatusRepository
  ]
})
export class NotificationsModule {}
