import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CommandsService],
  exports: [CommandsService]
})
export class CommandsModule { }
