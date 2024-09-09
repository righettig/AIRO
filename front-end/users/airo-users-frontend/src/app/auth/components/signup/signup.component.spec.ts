import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountTypeSelectionComponent } from './account-type-selection.component';
import { EmailInputComponent } from '../common/email-input.component';
import { PasswordInputComponent } from '../common/password-input.component';
import { ProgressBarComponent } from '../../../common/components/progress-bar/progress-bar.component';
import { ErrorMessageComponent } from '../common/error-message';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                AccountTypeSelectionComponent,
                EmailInputComponent,
                PasswordInputComponent,
                ProgressBarComponent,
                ErrorMessageComponent,
                NoopAnimationsModule
            ],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should signup successfully and navigate to /home', async () => {
        authService.signup.and.returnValue(Promise.resolve());

        component.email.setValue('test@example.com');
        component.password.setValue('password123');
        component.accountType = 'premium';

        await component.signup();

        expect(authService.signup).toHaveBeenCalledWith('test@example.com', 'password123', 'premium');
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
        expect(component.signingUp).toBeFalse();
    });

    it('should show error message if signup fails', async () => {
        authService.signup.and.returnValue(Promise.reject());

        component.email.setValue('test@example.com');
        component.password.setValue('password123');

        await component.signup();

        expect(authService.signup).toHaveBeenCalledWith('test@example.com', 'password123', 'free');
        expect(component.error).toBe('Error signing up. Try again!');
        expect(component.signingUp).toBeFalse();
    });

    it('should mark the form as valid', () => {
        component.email.setValue('foo@bar.com');
        component.password.setValue('1234567');

        expect(component.form.invalid).toBeFalse();
    });

    it('should mark the form as invalid', () => {
        component.email.setValue('');
        component.password.setValue('');

        expect(component.form.invalid).toBeTrue();
    });

    it('should disable the signup button when form is invalid', () => {
        component.email.setValue('');
        component.password.setValue('W');

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('.signup-btn');
        expect(button.disabled).toBeTrue();
    });

    it('should display progress bar while signing up', () => {
        component.signingUp = true;
        fixture.detectChanges();

        const progressBar = fixture.nativeElement.querySelector('app-progress-bar');
        expect(progressBar).toBeTruthy();
    });

    it('should show error message component when there is an error', () => {
        component.error = 'Error signing up. Try again!';
        fixture.detectChanges();

        const errorMessage = fixture.nativeElement.querySelector('app-error-message');
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.textContent).toContain('Error signing up. Try again!');
    });
});
