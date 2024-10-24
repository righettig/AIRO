import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MapsService } from './maps.service';

@Module({
  imports: [HttpModule],
  exports: [MapsService],
  providers: [MapsService],
})
export class MapsModule { }
