import { Component } from '@angular/core';
import { Bot } from '../../models/bot.model';
import { BotStoreService } from '../../services/bots-service';

@Component({
  selector: 'app-my-bots',
  templateUrl: './my-bots.component.html',
  styleUrl: './my-bots.component.scss',
  standalone: true,
  imports: []
})
export class MyBotsComponent {
  bots: Bot[] | undefined;

  constructor(private botStoreService: BotStoreService) { }

  async ngOnInit(): Promise<void> {
    this.bots = await this.botStoreService.getMyBots();
  }
  
  remove(botId: string) {
    
  }
}
