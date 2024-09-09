import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LogoComponent } from './logo/logo.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let userSubject = new BehaviorSubject<{ accountType: string }>( {accountType: 'pro' });
  let loggedInSubject = new BehaviorSubject<boolean>(true);

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn$', 'user$']);
    authServiceMock.isLoggedIn$ = loggedInSubject.asObservable();
    authServiceMock.user$ = userSubject.asObservable();

    await TestBed.configureTestingModule({
      imports:
        [
          MatToolbarModule,
          NavbarComponent, 
          LogoComponent, 
          UserProfileComponent
        ],
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the logo', () => {
    const logo = fixture.debugElement.query(By.css('app-logo'));
    expect(logo).toBeTruthy();
  });

  it('should display user profile when logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();

    const userProfile = fixture.debugElement.query(By.css('app-user-profile'));
    expect(userProfile).toBeTruthy();
  });

  it('should not display user profile when not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();

    const userProfile = fixture.debugElement.query(By.css('app-user-profile'));
    expect(userProfile).toBeNull();
  });

  it('should update account type when user data changes', () => {
    userSubject.next({ accountType: 'free' });
    fixture.detectChanges();

    expect(component.accountType).toBe('free');
  });

  it('should update isLoggedIn when logged in status changes', () => {
    loggedInSubject.next(false);
    fixture.detectChanges();

    expect(component.isLoggedIn).toBe(false);
  });
});
