import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function creditCardValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.replace(/\s+/g, ''); // Remove spaces for validation

    if (!value) {
      return null; // No error if value is empty
    }

    const cardPattern = /^[0-9]{16}$/;
    const isValid = luhnCheck(value);

    if (!cardPattern.test(value) || !isValid) {
      return { invalidCreditCard: true };
    }

    return null;
  };
}

function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

@Component({
  selector: 'app-credit-card-input',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>Credit Card Number</mat-label>
      <input
        matInput
        placeholder="Enter your credit card number"
        [formControl]="creditCard"
        name="creditCard"
        required
        (input)="onInputChange($event)"
      />
      <mat-icon matSuffix>payment</mat-icon>
      @if (creditCard.invalid && creditCard.touched) {
        <mat-error>
          @if (creditCard.errors?.['required']) { <span>Credit Card Number is required</span> }
          @if (creditCard.errors?.['invalidCreditCard']) { <span>Invalid credit card number</span> }
        </mat-error>
      }
    </mat-form-field>
  `
})
export class CreditCardInputComponent implements OnInit {
  @Input() creditCard!: FormControl;

  ngOnInit(): void {
    this.creditCard.addValidators(creditCardValidator());
    this.creditCard.updateValueAndValidity();
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digit characters

    // Format the value in groups of 4 digits
    if (value.length > 4) {
      value = value.match(/.{1,4}/g)?.join(' ') || value;
    }

    this.creditCard.setValue(value, { emitEvent: false }); // Set formatted value without triggering another value change event
  }
}
