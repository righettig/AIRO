import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputComponent } from './password-input.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PasswordInputComponent', () => {
    let component: PasswordInputComponent;
    let fixture: ComponentFixture<PasswordInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                PasswordInputComponent,
                ReactiveFormsModule,
                MatInputModule,
                MatButtonModule,
                MatIconModule,
                NoopAnimationsModule
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PasswordInputComponent);
        component = fixture.componentInstance;
        component.password = new FormControl('');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle password visibility', () => {
        // Initial state should be password hidden
        expect(component.showOrHidePassword()).toBeTrue();

        // Simulate click to toggle visibility
        component.togglePasswordVisibility();
        expect(component.showOrHidePassword()).toBeFalse();

        // Toggle back to hidden
        component.togglePasswordVisibility();
        expect(component.showOrHidePassword()).toBeTrue();
    });

    it('should display password in text type when visibility is toggled', () => {
        // Initial state, type should be 'password'
        let input = fixture.debugElement.query(By.css('input')).nativeElement;
        expect(input.type).toBe('password');

        // Toggle visibility
        component.togglePasswordVisibility();
        fixture.detectChanges();
        expect(input.type).toBe('text');

        // Toggle back to hidden
        component.togglePasswordVisibility();
        fixture.detectChanges();
        expect(input.type).toBe('password');
    });

    it('should show required error when password is touched and empty', () => {
        component.password.markAsTouched();
        component.password.setValue('');
        fixture.detectChanges();

        const errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.textContent.trim()).toBe('Password is required');
    });

    it('should show minlength error when password is less than 6 characters', () => {
        component.password.markAsTouched();
        component.password.setValue('123');
        fixture.detectChanges();

        const errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement.nativeElement.textContent.trim()).toBe('Password must be at least 6 characters long');
    });

    it('should not show error when password is valid', () => {
        component.password.markAsTouched();
        component.password.setValue('validPassword');
        fixture.detectChanges();

        const errorElement = fixture.debugElement.query(By.css('mat-error'));
        expect(errorElement).toBeNull();
    });
});
