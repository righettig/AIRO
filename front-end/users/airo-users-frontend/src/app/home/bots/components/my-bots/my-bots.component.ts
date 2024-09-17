import { Component, Input } from '@angular/core';
import { Bot } from '../../models/bot.model';

@Component({
  selector: 'app-my-bots',
  templateUrl: './my-bots.component.html',
  styleUrl: './my-bots.component.scss',
  standalone: true,
  imports: []
})
export class MyBotsComponent {
  @Input() bots: Bot[] = [];

  remove(botId: string) {
    
  }
}
