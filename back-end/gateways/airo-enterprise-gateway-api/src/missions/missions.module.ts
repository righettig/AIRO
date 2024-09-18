import { Module } from '@nestjs/common';
import { MissionsService } from './missions.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MissionsService],
  exports: [MissionsService]
})
export class MissionsModule { }
