import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BotBehaviour, BotBehaviourViewModel } from '../../models/bot-behaviour.model';
import { Bot } from '../../models/bot.model';
import { TitleComponent } from '../../../../../common/components/title/title.component';
import { CardComponent } from '../../../../../common/components/card/card.component';
import { BehaviourCodeComponent } from "./behaviour-code/behaviour-code.component";
import { BotBehavioursService } from '../../services/bot-behaviours.service';

@Component({
  selector: 'app-bot-details',
  templateUrl: './bot-details.component.html',
  styleUrl: './bot-details.component.scss',
  standalone: true,
  imports: [TitleComponent, CardComponent, BehaviourCodeComponent]
})
export class BotDetailsComponent {
  bot: Bot | undefined;
  botBehaviours: BotBehaviourViewModel[] = [];

  constructor(
    private route: ActivatedRoute, 
    private botBehavioursService: BotBehavioursService) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.botBehaviours = data['botBehaviours'];
      this.bot = data['bot'];
    });
  }

  async addBehaviour() {
    const newName = 
      'New Behaviour ' + (this.botBehaviours.filter(x => x.name.startsWith('New Behaviour')).length + 1);

    const newBehaviour = {
      id: '',
      name: newName,
      code: '',
      editing: true,
      modified: false
    };
    this.botBehaviours.unshift(newBehaviour);
  }

  async saveBehaviours() {
    for (const behaviour of this.botBehaviours) {
      if (!behaviour.id) {
        await this.botBehavioursService.createBotBehaviour(behaviour.name, behaviour.code);
      } else if (behaviour.modified) { // only saved modified behaviours
        await this.botBehavioursService.updateBotBehaviour(behaviour.id, behaviour.name, behaviour.code);
      }
    }
  }

  editBehaviour(behaviour: BotBehaviourViewModel) {
    behaviour.editing = !behaviour.editing;
  }

  confirmDeleteBehaviour(behaviour: BotBehaviour) {
    if (confirm("Are you sure you want to delete this behaviour?")) {
      this.deleteBehaviour(behaviour);
    }
  }

  async deleteBehaviour(behaviour: BotBehaviour) {
    if (behaviour.id) {
      await this.botBehavioursService.deleteBotBehaviour(behaviour.id);
    }

    this.botBehaviours = this.botBehaviours.filter(b => b.id !== behaviour.id);
  }

  markAsModified(behaviour: BotBehaviourViewModel, modified: boolean) {
    if (modified) {
      console.log(`Behaviour ${behaviour.name} marked as modified`);
    } else {
      console.log(`Behaviour ${behaviour.name} marked as not modified`);
    }

    behaviour.modified = modified;
  }

  codeModified(behaviour: BotBehaviourViewModel, newCode: string) {
    behaviour.code = newCode;
  }
}
