import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-behaviour-code',
  template: `
    <div class="behaviour-container">
      <div>{{name}} @if (isModified) {<span>*</span>} </div>
      @if (isReadOnly) {
        <pre>{{ code }}</pre>
      } @else {
        <textarea [(ngModel)]="code" (ngModelChange)="checkModified()"></textarea>
      }
    </div>
  `,
  styles: [`
    .behaviour-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    textarea {
      width: 60%;
      height: 100px;
    }
  `],
  standalone: true,
  imports: [FormsModule]
})
export class BehaviourCodeComponent {
  @Input() name: string = '';
  @Input() isReadOnly: boolean = false;

  private _initialCode: string = '';
  private _code: string = '';
  
  isModified: boolean = false;  // Track modification status

  @Input()
  set code(value: string) {
    this._code = value;
    if (!this._initialCode) {
      this._initialCode = value;  // Store the initial value when it's first set
    }
  }

  get code(): string {
    return this._code;
  }

  @Output() modified = new EventEmitter<boolean>();
  @Output() codeChange = new EventEmitter<string>();
  
  checkModified(): void {
    this.isModified = this._code !== this._initialCode;
    this.modified.emit(this.isModified);  // Emit true if modified, false otherwise
    this.codeChange.emit(this._code);
  }
}
