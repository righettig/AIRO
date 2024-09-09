import { MatMenuHarness } from '@angular/material/menu/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserProfileComponent } from './user-profile.component';
import { TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

let loader: HarnessLoader;

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
        UserProfileComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    component.accountType = 'free';
    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display accountType in title case', () => {
    const accountTypeElement: HTMLElement = fixture.nativeElement.querySelector('.account-type');
    expect(accountTypeElement.textContent).toBe('Free');
  });

  it('should render the user profile menu items', async () => {
    const profileMenu = await loader.getHarness(MatMenuHarness);
    await profileMenu.open();
    expect(await profileMenu.isOpen()).toBe(true);

    const items = await profileMenu.getItems();
    expect(items.length).toBe(3);

    const menuTexts = await Promise.all(
      items.map(async (item) => {
        var el = TestbedHarnessEnvironment.getNativeElement(await item.host());
        return el.querySelector('span')?.innerText;
      }));

    expect(menuTexts).toEqual(['Profile', 'Settings', 'Logout']);
  });

  it('should call authService.logout and navigate to /login when onLogout is called', fakeAsync(async () => {
    authServiceSpy.logout.and.returnValue(Promise.resolve());

    const profileMenu = await loader.getHarness(MatMenuHarness);
    await profileMenu.open();
    
    const logout = (await profileMenu.getItems())[2];
    logout.click();
    
    tick(); // Simulate passage of time for promises

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));
});