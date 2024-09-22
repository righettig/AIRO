import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MyBotsComponent } from "./my-bots/my-bots.component";
import { BotListComponent } from "./bot-list/bot-list.component";
import { BotStoreService } from '../services/bot-store.service';
import { Bot } from '../models/bot.model';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-bots',
  standalone: true,
  templateUrl: './bots.component.html',
  styleUrl: './bots.component.scss',
  imports: [AsyncPipe, MyBotsComponent, BotListComponent]
})
export class BotsComponent implements OnInit {
  bots: Bot[] = [];
  myBots: Bot[] = [];
  isProUser$!: Observable<boolean>;
  freeBotsCount!: number;

  constructor(private authService: AuthService, private botStoreService: BotStoreService) { }

  async ngOnInit() {
    this.isProUser$ = this.authService.user$.pipe(map(user => {
      return user?.accountType === 'pro'
    }));

    this.freeBotsCount = await this.botStoreService.getFreeBotsCount();

    this.bots = await this.botStoreService.getAllBots();
    this.myBots = await this.botStoreService.getMyBots();
  }

  async onBuy(botId: string) {
    if (window.confirm('Are you sure you want to get this bot?')) {
      try {
        await this.botStoreService.purchaseBot(botId);

        const newBot = this.bots?.find(x => x.id == botId)!;
        this.myBots = [...this.myBots, newBot];
        
      } catch (err) {
        console.log("Error buying bot: " + botId);
      }
    }
  }
}
