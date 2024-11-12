import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pre-alpha-dialog',
  templateUrl: './pre-alpha-dialog.component.html',
  styleUrls: ['./pre-alpha-dialog.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatButton]
})
export class PreAlphaDialogComponent {
  constructor(public dialogRef: MatDialogRef<PreAlphaDialogComponent>) {}

  closeDialog(): void {
    // Set flag in local storage so it doesn't show again
    localStorage.setItem('showPreAlphaMessage', 'false');
    this.dialogRef.close();
  }
}
