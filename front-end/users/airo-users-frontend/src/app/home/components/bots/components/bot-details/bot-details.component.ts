import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BotBehaviour } from '../../models/bot-behaviour.model';
import { Bot } from '../../models/bot.model';
import { TitleComponent } from '../../../../../common/components/title/title.component';
import { CardComponent } from '../../../../../common/components/card/card.component';

@Component({
  selector: 'app-bot-details',
  templateUrl: './bot-details.component.html',
  styleUrl: './bot-details.component.scss',
  standalone: true,
  imports: [TitleComponent, CardComponent]
})
export class BotDetailsComponent {
  bot: Bot | undefined;
  botBehaviours: BotBehaviour[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.botBehaviours = data['botBehaviours'];
      this.bot = data['bot'];
    });
  }
}
