import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { NotificationsService } from './notifications.service';

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
  providers: [NotificationsService]  
})
export class NotificationsModule {}
