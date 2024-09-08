import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { EmailInputComponent } from './email-input.component';
import { By } from '@angular/platform-browser';

describe('EmailInputComponent', () => {
    let component: EmailInputComponent;
    let fixture: ComponentFixture<EmailInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, MatInputModule, MatIconModule],
            declarations: [EmailInputComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EmailInputComponent);
        component = fixture.componentInstance;
        component.email = new FormControl('');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display required error when email is touched and empty', () => {
        component.email.markAsTouched();
        component.email.setValue('');
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('mat-error span')).nativeElement;
        expect(errorMessage.textContent).toContain('Email is required');
    });

    it('should display invalid email error when email is incorrect', () => {
        component.email.markAsTouched();
        component.email.setValue('invalidEmail');
        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.css('mat-error span')).nativeElement;
        expect(errorMessage.textContent).toContain('Please enter a valid email address');
    });

    it('should not display any error when email is valid', () => {
        component.email.markAsTouched();
        component.email.setValue('valid@example.com');
        fixture.detectChanges();

        const errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement).toBeNull();
    });
});
