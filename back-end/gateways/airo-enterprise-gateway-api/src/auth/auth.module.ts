import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule { }
