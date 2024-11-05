import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-behaviour-code',
  template: `
    <div class="behaviour-container">
      <div class="title-bar">
        <div>{{name}} @if (isModified) {<span>*</span>}</div>
        <div style="display: flex; gap: 4px;">
          <button (click)="validate.emit()">Validate</button>
          <button (click)="edit.emit()">Edit</button>
          <button (click)="delete.emit()">Delete</button>
        </div>
      </div>
      <div class="content">
        @if (isReadOnly) {
          <pre>{{ code }}</pre>
        } @else {
          <textarea [(ngModel)]="code" (ngModelChange)="checkModified()"></textarea>
        }
      </div>
      <!-- <div class="validation-result">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non eligendi, pariatur, cupiditate similique alias aperiam reprehenderit fugiat quas vel laudantium fugit dolores, explicabo possimus magni iusto rem blanditiis sit dignissimos.
          Id assumenda voluptate totam cumque, facere qui distinctio reprehenderit expedita voluptates quisquam ab sit consectetur veniam asperiores modi dolor minus nisi inventore placeat veritatis quo. Quia tenetur corrupti accusantium pariatur?
      </div> -->
    </div>
  `,
  styleUrl: './behaviour-code.component.scss',
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
  @Output() validate = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  
  checkModified(): void {
    this.isModified = this._code !== this._initialCode;
    this.modified.emit(this.isModified);  // Emit true if modified, false otherwise
    this.codeChange.emit(this._code);
  }
}
