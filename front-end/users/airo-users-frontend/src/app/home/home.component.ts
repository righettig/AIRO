import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BotsComponent } from './components/bots/components/bots.component';
import { PreAlphaDialogComponent } from '../pre-alpha-dialog/pre-alpha-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [BotsComponent, RouterModule]
})
export class HomeComponent {
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    // Check if the user has seen the message before
    const showPreAlphaMessage = localStorage.getItem('showPreAlphaMessage');

    // If not set, show the dialog
    if (showPreAlphaMessage !== 'false') {
      this.openPreAlphaDialog();
    }
  }

  openPreAlphaDialog(): void {
    this.dialog.open(PreAlphaDialogComponent, {
      width: '600px', // Optional: Set the dialog size
      disableClose: true // Optional: Prevent closing by clicking outside the dialog
    });
  }
}
