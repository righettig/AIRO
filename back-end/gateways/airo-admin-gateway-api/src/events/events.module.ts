import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventsService } from './events.service';

@Module({
  imports: [HttpModule],
  exports: [EventsService],
  providers: [EventsService],
})
export class EventsModule { }
