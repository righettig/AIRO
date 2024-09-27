import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UiNotificationsService } from './ui-notifications.service';

@Module({
  imports: [HttpModule],
  exports: [UiNotificationsService],
  providers: [UiNotificationsService],
})
export class UiNotificationsModule { }
