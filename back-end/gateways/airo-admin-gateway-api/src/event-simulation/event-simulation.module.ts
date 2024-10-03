import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EventSimulationService } from './event-simulation.service';

@Module({
  imports: [HttpModule],
  exports: [EventSimulationService],
  providers: [EventSimulationService],
})
export class EventSimulationModule { }
