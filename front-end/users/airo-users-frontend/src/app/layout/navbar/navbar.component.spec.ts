import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { Component } from '@angular/core';
import { LogoComponent } from './logo/logo.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthService } from '../../auth/services/auth.service';
import { of } from 'rxjs';

@Component({standalone: true, selector: "app-logo"})
class MockLogoComponent {
}

@Component({standalone: true, selector: "app-user-profile"})
class MockUserProfileComponent {
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceStub: any;

  beforeEach(async () => {
    authServiceStub = { 
      isLoggedIn$: of(),
      user$: of()
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, MockLogoComponent, MockUserProfileComponent],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
      ]
    })
    .overrideComponent(NavbarComponent, {
      remove: { imports: [ LogoComponent, UserProfileComponent] },
      add: { imports: [ MockLogoComponent, MockUserProfileComponent ] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
