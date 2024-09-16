import { Component, Input, OnInit } from '@angular/core';
import { BotStoreService } from '../../services/bots-service';
import { Bot } from '../../models/bot.model';

@Component({
  selector: 'app-bot-list',
  templateUrl: './bot-list.component.html',
  styleUrl: './bot-list.component.scss',
  standalone: true,
  imports: []
})
export class BotListComponent implements OnInit {
  @Input() canGetBotsForFree: boolean = false;

  bots: Bot[] | undefined;

  constructor(private botStoreService: BotStoreService) { }

  async ngOnInit(): Promise<void> {
    this.bots = await this.botStoreService.getAllBots();
  }

  async buy(botId: string) {
    if (window.confirm('Are you sure you want to get this bot?')) {
      try {
        await this.botStoreService.purchaseBot(botId);
      } catch (err) {
        console.log("Error buying bot: " + botId);
      }
    }
  }

  upgrade(): void {

  }
}
