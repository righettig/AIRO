import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ProfileGeneralComponent } from './profile-general.component';
import { ProfileService } from '../../services/profile.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileGeneralComponent', () => {
    let component: ProfileGeneralComponent;
    let fixture: ComponentFixture<ProfileGeneralComponent>;
    let profileServiceSpy: jasmine.SpyObj<ProfileService>;

    const mockProfile = { firstName: 'John', lastName: 'Doe' };

    beforeEach(async () => {
        const profileServiceMock = jasmine.createSpyObj('ProfileService', ['getProfile', 'updateProfile']);

        await TestBed.configureTestingModule({
            imports: [ProfileGeneralComponent, NoopAnimationsModule],
            providers: [
                FormBuilder,
                { provide: ProfileService, useValue: profileServiceMock }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileGeneralComponent);
        component = fixture.componentInstance;
        profileServiceSpy = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;

        profileServiceSpy.getProfile.and.returnValue(Promise.resolve(mockProfile));
        profileServiceSpy.updateProfile.and.returnValue(Promise.resolve({}));
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize the form with profile data', async () => {
        fixture.detectChanges();  // Triggers ngOnInit
        await fixture.whenStable(); // Wait for async operations

        expect(profileServiceSpy.getProfile).toHaveBeenCalled();
        expect(component.firstName.value).toBe(mockProfile.firstName);
        expect(component.lastName.value).toBe(mockProfile.lastName);
    });

    it('should not call updateProfile when the form is invalid', async () => {
        component.firstName.setValue(''); // Invalid form (empty firstName)
        component.lastName.setValue('Doe');
        fixture.detectChanges();

        await component.updateProfile();

        expect(profileServiceSpy.updateProfile).not.toHaveBeenCalled();
    });

    it('should call updateProfile when the form is valid', async () => {
        component.firstName.setValue('John');
        component.lastName.setValue('Doe');

        await component.updateProfile();

        expect(profileServiceSpy.updateProfile).toHaveBeenCalledWith('John', 'Doe');
    });
});
