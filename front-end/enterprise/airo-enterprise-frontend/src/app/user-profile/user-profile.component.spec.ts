import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';
import { UserProfileComponent } from './user-profile.component';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let isLoggedInSubject: BehaviorSubject<boolean>;

  const setupAuthService = (isLoggedIn: boolean) => {
    isLoggedInSubject.next(isLoggedIn);
    fixture.detectChanges();
  };

  const getActionText = () =>
    fixture.debugElement.query(By.css('p')).nativeElement.textContent.trim();

  const clickAction = () =>
    fixture.debugElement.query(By.css('p')).triggerEventHandler('click', null);

  beforeEach(async () => {
    isLoggedInSubject = new BehaviorSubject<boolean>(false); // Default to logged out
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'logout'], {
      isLoggedIn: isLoggedInSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Login" when the user is logged out', () => {
    setupAuthService(false);
    expect(getActionText()).toBe('Login');
  });

  it('should call authService.login when "Login" is clicked', () => {
    setupAuthService(false);
    clickAction();
    expect(authServiceMock.login).toHaveBeenCalled();
  });

  it('should display "Logout" when the user is logged in', () => {
    setupAuthService(true);
    expect(getActionText()).toBe('Logout');
  });

  it('should call authService.logout when "Logout" is clicked', () => {
    setupAuthService(true);
    clickAction();
    expect(authServiceMock.logout).toHaveBeenCalled();
  });
});
