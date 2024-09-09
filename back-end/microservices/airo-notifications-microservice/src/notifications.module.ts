import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { EmailService } from './email/email.service';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [EmailService],
})
export class NotificationsModule {}
