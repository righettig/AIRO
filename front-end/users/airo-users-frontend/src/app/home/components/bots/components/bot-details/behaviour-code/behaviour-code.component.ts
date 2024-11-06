import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-behaviour-code',
  template: `
    <div class="container">
      <div class="top-panel">
        <div class="title-bar">
          <div>
            @if (isReadOnly) { 
              <span>{{ name }}</span> 
            } @else {
              <input [(ngModel)]="editableName" (ngModelChange)="onNameChange()" />
            }
            @if (isModified) {<span>*</span>}
          </div>
          <div class="title-bar-actions">
            @if (isLoading) { <mat-spinner [diameter]="16"></mat-spinner> }
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
      </div>
      @if (validationResult?.errors!.length) {
        <section class="bottom-panel">
          <div class="bottom-panel-actions">
            <div>Errors: {{ validationResult!.errors.length }}</div>
            <button (click)="toggleCollapse()">
              {{ isCollapsed ? 'Expand' : 'Collapse' }}
            </button>
          </div>
          @if (!isCollapsed) {
            <div class="validation-content">
              @for (error of validationResult!.errors; track error) {
                <p (dblclick)="errorSelected(error)">{{ error }}</p>
              }
            </div>
          }
        </section>
      }
    </div>
  `,
  styleUrl: './behaviour-code.component.scss',
  standalone: true,
  imports: [FormsModule, MatProgressSpinnerModule]
})
export class BehaviourCodeComponent implements OnInit {
  @Input() name: string = '';
  @Input() isReadOnly: boolean = false;
  @Input() isLoading: boolean = false; 
  @Input() validationResult: { errors: string[] } | undefined = undefined;

  private _initialCode: string = '';
  private _code: string = '';
  
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
  @Output() nameChange = new EventEmitter<string>();
  
  isModified: boolean = false;  // Track modification status
  isCollapsed: boolean = true;  // Show/hide the validation errors panel

  editableName: string = '';

  ngOnInit(): void {
    this.editableName = this.name;
  }

  onNameChange() {
    this.nameChange.emit(this.editableName);  // Emit the new name when it changes
  }

  checkModified(): void {
    this.isModified = this._code !== this._initialCode;
    this.modified.emit(this.isModified);  // Emit true if modified, false otherwise
    this.codeChange.emit(this._code);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  errorSelected(error: string) {
    alert(error);
  }
}
