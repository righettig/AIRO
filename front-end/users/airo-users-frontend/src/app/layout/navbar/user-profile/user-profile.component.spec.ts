import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { TitleCasePipe } from '@angular/common';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        TitleCasePipe,
        UserProfileComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    component.accountType = 'free';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display accountType in title case', () => {
    const accountTypeElement: HTMLElement = fixture.nativeElement.querySelector('.account-type');
    expect(accountTypeElement.textContent).toBe('Free');
  });

  it('should display profile menu items', () => {
    const menuItems = fixture.nativeElement.querySelectorAll('button[mat-menu-item]');
    expect(menuItems.length).toBe(3);
    expect(menuItems[0].textContent).toContain('Profile');
    expect(menuItems[1].textContent).toContain('Settings');
    expect(menuItems[2].textContent).toContain('Logout');
  });

  it('should call authService.logout and navigate to /login when onLogout is called', fakeAsync(() => {
    authServiceSpy.logout.and.returnValue(Promise.resolve());

    const logoutButton = fixture.nativeElement.querySelector('button[mat-menu-item]:last-child');
    logoutButton.click();
    tick(); // Simulate passage of time for promises

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
