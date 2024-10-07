import { Component, inject, Input } from '@angular/core';
import { Bot } from '../../models/bot.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-bots',
  templateUrl: './my-bots.component.html',
  styleUrl: './my-bots.component.scss',
  standalone: true,
  imports: [RouterModule]
})
export class MyBotsComponent {
  @Input() bots: Bot[] = [];

  router = inject(Router);

  details(botId: string) {
    this.router.navigate(['/bots', botId]);
  }
}
