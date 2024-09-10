import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL], // 'amqp://localhost:5672'
      queue: 'user.created',
      queueOptions: {
        durable: true
      }
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL], // 'amqp://localhost:5672'
      queue: 'invoice.created',
    },
  });

  await app.startAllMicroservices();
}
bootstrap();
