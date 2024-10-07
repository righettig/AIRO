import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-title',
    template: `
    <div [ngStyle]="{'background-color': backgroundColor}">
      <ng-content></ng-content>
    </div>
  `,
    styles: [`
    div {
      border-radius: 4px;
      padding: 14px;
    }
  `],
    standalone: true,
    imports: [NgStyle]
})
export class TitleComponent {
    @Input() backgroundColor: string = 'lightskyblue';
}