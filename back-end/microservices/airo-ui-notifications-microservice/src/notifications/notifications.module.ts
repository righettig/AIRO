import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from './services/config.service';
import { NotificationsService } from './services/notifications.service';
import { InMemoryUiNotificationRepository, UI_NOTIFICATION_REPOSITORY, UiNotificationRepository } from './services/notifications-repository.service';
import { InMemoryUiNotificationStatusRepository, UI_NOTIFICATION_STATUS_REPOSITORY, UiNotificationStatusRepository } from './services/notifications-status.repository.service';
import { UiNotificationController } from './controllers/ui-notifications.controller';
import { BotCreatedEventHandler } from './handlers/bot-created-event.handler';
import { EventCreatedEventHandler } from './handlers/event-created-event.handler';
import { EventSubscribedEventHandler } from './handlers/event-subscribed-event.handler';
import { EventUnsubscribedEventHandler } from './handlers/event-unsubscribed-event.handler';
import { EventHandlerFactory } from './handlers/event-handler-factory';
import { HttpModule } from '@nestjs/axios';
import { EventsService } from './services/events.service';

@Module({
  imports: [
    HttpModule,
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
    EventHandlerFactory,
    BotCreatedEventHandler,
    EventCreatedEventHandler,
    EventSubscribedEventHandler,
    EventUnsubscribedEventHandler,
    EventsService,
    {
      provide: UI_NOTIFICATION_REPOSITORY,
      useFactory: (configService: ConfigService) => {
        if (configService.useInMemoryDb) {
          console.log("Using in-memory impl for IUiNotificationRepository.")
        }
        return configService.useInMemoryDb 
          ? new InMemoryUiNotificationRepository() 
          : new UiNotificationRepository(configService);
      },
      inject: [ConfigService],
    },
    {
      provide: UI_NOTIFICATION_STATUS_REPOSITORY,
      useFactory: (configService: ConfigService) => {
        if (configService.useInMemoryDb) {
          console.log("Using in-memory impl for IUiNotificationStatusRepository.")
        }
        return configService.useInMemoryDb 
          ? new InMemoryUiNotificationStatusRepository()
          : new UiNotificationStatusRepository(configService);
      },
      inject: [ConfigService],
    },
  ]
})
export class NotificationsModule {}
