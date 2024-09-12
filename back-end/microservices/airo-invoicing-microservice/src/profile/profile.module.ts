import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ProfileService],
  exports: [ProfileService]
})
export class ProfileModule {}
