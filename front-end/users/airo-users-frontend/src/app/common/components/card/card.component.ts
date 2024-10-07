import { Component, Input } from "@angular/core";
import { TitleComponent } from "../title/title.component";

@Component({
    selector: 'app-card',
    template: `
      <div class="container">
          <app-title [backgroundColor]="titleBackgroundColor">{{title}}</app-title>
          <div>
            <ng-content></ng-content>
          </div>
      </div>
    `,
    styles: [`
      .container {
        margin-bottom: 20px; 
        background-color: lightcyan;
        
        & > div {
          padding: 10px;
        }
      }
    `],
    standalone: true,
    imports: [TitleComponent]
  })
  export class CardComponent {
    @Input() title: string = '';
    @Input() titleBackgroundColor: string = 'lightskyblue';
  }
  