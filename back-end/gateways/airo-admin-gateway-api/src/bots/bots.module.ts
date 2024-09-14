import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BotsService } from './bots.service';

@Module({
  imports: [HttpModule],
  exports: [BotsService],
  providers: [BotsService],
})
export class BotsModule { }
