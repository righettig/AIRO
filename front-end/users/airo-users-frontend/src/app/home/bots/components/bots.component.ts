import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MyBotsComponent } from "./my-bots/my-bots.component";
import { BotListComponent } from "./bot-list/bot-list.component";
import { BotStoreService } from '../services/bots-service';

@Component({
  selector: 'app-bots',
  standalone: true,
  templateUrl: './bots.component.html',
  styleUrl: './bots.component.scss',
  imports: [AsyncPipe, MyBotsComponent, BotListComponent]
})
export class BotsComponent implements OnInit {
  isProUser$!: Observable<boolean>;
  freeBotsCount!: number;

  constructor(private authService: AuthService, private botsStoreService: BotStoreService) { }

  async ngOnInit() {
    this.isProUser$ = this.authService.user$.pipe(map(user => {
      return user?.accountType === 'pro'
    }));

    this.freeBotsCount = await this.botsStoreService.getFreeBotsCount();
  }
}
