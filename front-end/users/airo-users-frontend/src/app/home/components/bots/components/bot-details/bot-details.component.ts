import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BotBehaviour, BotBehaviourViewModel } from '../../models/bot-behaviour.model';
import { Bot } from '../../models/bot.model';
import { TitleComponent } from '../../../../../common/components/title/title.component';
import { CardComponent } from '../../../../../common/components/card/card.component';
import { BehaviourCodeComponent } from "./behaviour-code/behaviour-code.component";
import { BotBehavioursService, BotValidationResponse } from '../../services/bot-behaviours.service';
import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-bot-details',
  templateUrl: './bot-details.component.html',
  styleUrl: './bot-details.component.scss',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    TitleComponent, 
    CardComponent, 
    BehaviourCodeComponent, 
    NgClass
  ]
})
export class BotDetailsComponent {
  bot: Bot | undefined;
  botBehaviours: BotBehaviourViewModel[] = [];
  selectedBehaviour: BotBehaviourViewModel | undefined;
  isLoading: boolean = false;
  validationResult: BotValidationResponse | undefined;
  isSaving: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private botBehavioursService: BotBehavioursService) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.botBehaviours = data['botBehaviours'];
      this.bot = data['bot'];

      // Select the first behaviour in the list if available
      if (this.botBehaviours.length > 0) {
        this.selectBehaviour(this.botBehaviours[0]);
      }
    });
  }

  hasModifiedBehaviours(): boolean {
    return this.botBehaviours.some(behaviour => behaviour.modified);
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

    // Set the newly added behaviour as the selected one
    this.selectBehaviour(newBehaviour);
  }

  async saveAllBehaviours() {
    this.isSaving = true;
    try {
      for (const behaviour of this.botBehaviours) {
        if (!behaviour.id) {
          await this.botBehavioursService.createBotBehaviour(behaviour.name, behaviour.code);
        } else if (behaviour.modified) { // only save modified behaviours
          await this.botBehavioursService.updateBotBehaviour(behaviour.id, behaviour.name, behaviour.code);
        }
      }
    } catch (error) {
      console.error('Error saving behaviours', error);
    } finally {
      this.isSaving = false;
    }
  }

  async validateBehaviour(behaviour: BotBehaviourViewModel) {
    this.isLoading = true;
    try {
      this.validationResult = await this.botBehavioursService.validateBotBehaviour(behaviour.id, behaviour.code);
    } finally {
      this.isLoading = false;
    }
  }

  selectBehaviour(behaviour: BotBehaviourViewModel) {
    this.selectedBehaviour = behaviour;
    this.clearValidationResult();
  }

  clearValidationResult() {
    this.validationResult = undefined;
  }

  updateBehaviourName(newName: string) {
    if (this.selectedBehaviour) {
      this.selectedBehaviour.name = newName;
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
