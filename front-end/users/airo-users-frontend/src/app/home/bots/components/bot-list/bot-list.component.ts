import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bot } from '../../models/bot.model';

@Component({
  selector: 'app-bot-list',
  templateUrl: './bot-list.component.html',
  styleUrl: './bot-list.component.scss',
  standalone: true,
  imports: []
})
export class BotListComponent {
  @Input() canGetBotsForFree: boolean = false;
  @Input() bots: Bot[] = [];

  @Output() onBuy = new EventEmitter<string>();

  async buy(botId: string) {
    this.onBuy.emit(botId);
  }

  upgrade(): void {

  }
}
