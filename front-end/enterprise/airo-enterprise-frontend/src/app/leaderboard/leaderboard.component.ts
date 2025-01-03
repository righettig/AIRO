import { Component, OnInit } from '@angular/core';
import { BehaviourLeaderboardEntry, LeaderboardService } from './leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
  standalone: true,
  imports: []
})
export class LeaderboardComponent implements OnInit {
  leaderboard!: BehaviourLeaderboardEntry[];

  constructor(private readonly leaderboardService: LeaderboardService) {
  }

  async ngOnInit() {
    this.leaderboard = await this.leaderboardService.getTopNLeaderboard(5);
  }
}
