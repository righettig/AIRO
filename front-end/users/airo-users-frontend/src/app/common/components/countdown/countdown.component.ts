import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  template: `
    @if (isCountdownComplete) {
      <ng-content></ng-content>
    } @else {
      <div>{{ formatTime(countdown) }}</div>
    }
  `,
  standalone: true
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() targetDate!: Date; // Input date as Date object

  countdown: number = 0;
  isCountdownComplete: boolean = false;

  private countdownSubscription!: Subscription;

  ngOnInit() {
    this.updateCountdown();

    // Update countdown every second
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdown();
    });
  }

  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  private updateCountdown() {
    const now = Date.now(); // Get the current time in milliseconds
    const target = this.targetDate.getTime(); // Get the target time in milliseconds
    this.countdown = target - now; // Calculate the remaining time in milliseconds

    if (this.countdown <= 0) {
      this.isCountdownComplete = true;
      this.countdown = 0; // Reset countdown to 0
    }
  }

  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000); // Convert to total seconds
    const hours = Math.floor(totalSeconds / 3600); // Calculate hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Calculate minutes
    const seconds = totalSeconds % 60; // Calculate remaining seconds

    // Format as HH:mm:ss, ensuring two digits for each
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
