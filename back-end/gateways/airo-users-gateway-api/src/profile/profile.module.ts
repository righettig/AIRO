import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [ProfileService],
  providers: [ProfileService]
})
export class ProfileModule {}
