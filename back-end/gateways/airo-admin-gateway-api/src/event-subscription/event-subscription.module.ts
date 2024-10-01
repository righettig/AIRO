import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventSubscriptionService } from './event-subscription.service';

@Module({
  imports: [HttpModule],
  exports: [EventSubscriptionService],
  providers: [EventSubscriptionService],
})
export class EventSubscriptionModule { }
