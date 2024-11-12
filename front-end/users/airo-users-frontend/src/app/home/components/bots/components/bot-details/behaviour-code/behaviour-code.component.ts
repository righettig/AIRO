import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

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
            <button (click)="toggleEdit()">Edit</button>
            <button (click)="delete.emit()">Delete</button>
          </div>
        </div>
        <div class="content">
          <ngx-monaco-editor class="editor"
            [options]="editorOptions" 
            [(ngModel)]="code"
            (onInit)="onEditorInit($event)"
            (ngModelChange)="checkModified()"
          >
          </ngx-monaco-editor>
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
  imports: [FormsModule, MatProgressSpinnerModule, MonacoEditorModule]
})
export class BehaviourCodeComponent implements OnInit {
  @Input() name: string = '';
  @Input() isReadOnly: boolean = false;
  @Input() isLoading: boolean = false; 
  @Input() validationResult: { errors: string[] } | undefined = undefined;

  private _initialCode: string = '';
  private _code: string = '';
  
  editorOptions = { 
    language: 'csharp', // https://github.com/dotnetprojects/MonacoRoslynCompletionProvider
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 13,
    wordWrap: 'on',
    wrappingIndent: 'indent',
    readOnly: true,
    // theme: "vs-dark",
    // language: 'typescript',
  };

  private editorInstance: any;

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

  onEditorInit(editor: any) {
    this.editorInstance = editor;

    // Define custom themes for editable and read-only modes
    this.editorInstance._themeService.defineTheme('readOnlyTheme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: '', foreground: '888888' }, // General muted color
        { token: 'comment', foreground: '6a9955', fontStyle: 'italic' } // Muted comments
      ],
      colors: {
        'editor.background': '#f3f3f3', // Lighter background
        'editor.foreground': '#888888', // Muted text
        'editorCursor.foreground': '#888888', // Gray cursor for read-only
        'editor.lineHighlightBackground': '#e0e0e0', // Subtle line highlight
        'editor.selectionBackground': '#d0d0d0' // Muted selection
      }
    });

    this.editorInstance._themeService.setTheme('readOnlyTheme');
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

  toggleEdit() {
    const currentReadOnly = this.editorInstance.getRawOptions().readOnly;
    this.editorInstance.updateOptions({ readOnly: !currentReadOnly });

    // Change the theme based on the new read-only state
    const newTheme = !currentReadOnly ? 'readOnlyTheme' : 'vs';
    this.editorInstance._themeService.setTheme(newTheme);

    this.edit.emit();
  }
}
