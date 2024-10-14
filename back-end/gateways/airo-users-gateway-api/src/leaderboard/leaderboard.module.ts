import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [HttpModule],
  exports: [LeaderboardService],
  providers: [LeaderboardService]
})
export class LeaderboardModule {}
