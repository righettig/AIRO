import { Component, Input } from '@angular/core';
import { MatError } from '@angular/material/input';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [MatError],
  template: `
    <div style="text-align: center;">
      <mat-error>
        <ng-content></ng-content>
      </mat-error>
    </div>
  `
})
export class ErrorMessageComponent {
  @Input() message = '';
}
