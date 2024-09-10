import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditCardInputComponent } from './credit-card-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

describe('CreditCardInputComponent', () => {
    let component: CreditCardInputComponent;
    let fixture: ComponentFixture<CreditCardInputComponent>;
    let creditCardControl: FormControl;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule, 
                MatInputModule, 
                MatIconModule,
                CreditCardInputComponent
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreditCardInputComponent);
        component = fixture.componentInstance;

        // Create a FormControl and pass it to the component
        creditCardControl = new FormControl('');
        component.creditCard = creditCardControl;

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should add the credit card validator on init', () => {
        // Spy on the credit card control's addValidators method
        spyOn(creditCardControl, 'addValidators').and.callThrough();

        component.ngOnInit();

        expect(creditCardControl.addValidators).toHaveBeenCalled();
        expect(creditCardControl.validator).toBeTruthy(); // Validator should be attached
    });

    it('should format the credit card input in groups of four digits', () => {
        const inputEl = fixture.debugElement.query(By.css('input')).nativeElement;

        inputEl.value = '40128888';
        inputEl.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.creditCard.value).toBe('4012 8888');

        inputEl.value = '4012888888881881';
        inputEl.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(component.creditCard.value).toBe('4012 8888 8888 1881');
    });

    it('should validate a valid credit card number', () => {
        creditCardControl.setValue('4012 8888 8888 1881');
        fixture.detectChanges();

        expect(creditCardControl.valid).toBeTruthy();
        expect(creditCardControl.errors).toBeNull();
    });

    it('should invalidate an invalid credit card number', () => {
        creditCardControl.setValue('1234 5678 9012 3456'); // Invalid Luhn check
        fixture.detectChanges();

        expect(creditCardControl.invalid).toBeTruthy();
        expect(creditCardControl.errors?.['invalidCreditCard']).toBeTruthy();
    });

    it('should display the error message for an invalid credit card number', () => {
        creditCardControl.setValue('1234 5678 9012 3456'); // Invalid Luhn check
        creditCardControl.markAsTouched(); // Mark as touched to trigger error display
        fixture.detectChanges();

        const errorEl = fixture.debugElement.query(By.css('mat-error')).nativeElement;

        expect(errorEl.textContent).toContain('Invalid credit card number');
    });

    it('should display the error message for a required credit card number', () => {
        creditCardControl.setValue(''); // Empty value
        creditCardControl.markAsTouched();
        fixture.detectChanges();

        const errorEl = fixture.debugElement.query(By.css('mat-error')).nativeElement;

        expect(errorEl.textContent).toContain('Credit Card Number is required');
    });
});
