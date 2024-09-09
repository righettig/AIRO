import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailInputComponent } from '../common/email-input.component';
import { PasswordInputComponent } from '../common/password-input.component';
import { PredefinedUserSelectionComponent } from '../common/predefined-user-selection.component';
import { ProgressBarComponent } from '../../../common/components/progress-bar/progress-bar.component';
import { ErrorMessageComponent } from '../common/error-message';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from '../../../home/home.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PredefinedUserSelectionComponent,
        EmailInputComponent,
        PasswordInputComponent,
        ProgressBarComponent,
        ErrorMessageComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([
          { path: 'login', component: LoginComponent },
          { path: 'home', component: HomeComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully and navigate to /home', async () => {
    authService.login.and.returnValue(Promise.resolve());

    component.email.setValue('test@example.com');
    component.password.setValue('password123');

    await component.login();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(TestBed.inject(Router).url).toEqual('/home');
    expect(component.loggingIn).toBeFalse();
  });

  it('should show error message if login fails', async () => {
    authService.login.and.returnValue(Promise.reject());

    component.email.setValue('test@example.com');
    component.password.setValue('password123');

    await component.login();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(component.error).toBe('Error logging in. Try again!');
    expect(component.loggingIn).toBeFalse();
  });

  it('should patch form values when a predefined user is selected', () => {
    const user = { email: 'giacomo@airo.com', password: 'q1w2e3' };

    component.onUserSelected(user);

    expect(component.form.value).toEqual(user);
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

  it('should disable the login button when form is invalid', () => {
    component.email.setValue('');
    component.password.setValue('');

    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.login-btn');
    expect(button.disabled).toBeTrue();
  });
});
