import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  private _active: boolean = true;

  showNotification(message: string, action: string = 'Close', duration: number = 5000): void {
    if (this._active) {
      this.snackBar.open(message, action, {
        duration: duration,
      });
    }
  }

  toggleShowSuppressNotifications() {
    this._active = !this._active;
  }
}
