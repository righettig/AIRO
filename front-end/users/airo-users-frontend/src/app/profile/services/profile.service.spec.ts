import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { AuthService } from '../../auth/services/auth.service';
import { ConfigService } from '../../common/services/config.service';
import { Profile } from '../models/profile';
import { provideHttpClient } from '@angular/common/http';

describe('ProfileService', () => {
    let service: ProfileService;
    let httpMock: HttpTestingController;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    const mockProfile: Profile = { firstName: 'John', lastName: 'Doe' };

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', [], { accessToken: 'fake-token' });
        const configSpy = jasmine.createSpyObj('ConfigService', ['config']);

        TestBed.configureTestingModule({
            providers: [
                ProfileService,
                { provide: AuthService, useValue: authSpy },
                { provide: ConfigService, useValue: configSpy },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(ProfileService);
        httpMock = TestBed.inject(HttpTestingController);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;

        configServiceSpy.config = { gatewayApiUrl: 'https://api.example.com' };
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should fetch the user profile', async () => {
        service.getProfile().then(profile => {
            expect(profile).toEqual(mockProfile);
        });

        const req = httpMock.expectOne('https://api.example.com/gateway/user');
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('Authorization')).toBe('fake-token');

        req.flush(mockProfile);
    });

    it('should update the user profile', async () => {
        const mockUpdateResponse = { success: true };

        service.updateProfile('Jane', 'Smith').then(response => {
            expect(response).toEqual(mockUpdateResponse);
        });

        const req = httpMock.expectOne('https://api.example.com/gateway/user');
        expect(req.request.method).toBe('PATCH');
        expect(req.request.headers.get('Authorization')).toBe('fake-token');
        expect(req.request.body).toEqual({ firstName: 'Jane', lastName: 'Smith' });

        req.flush(mockUpdateResponse);
    });
});
