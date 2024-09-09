import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let loggedInSubject = new BehaviorSubject<boolean>(true);
    
    beforeEach(() => {
        const authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn$', 'user$']);
        authServiceMock.isLoggedIn$ = loggedInSubject.asObservable();

        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                AuthGuard,
                { provide: AuthService, useValue: authServiceMock },
                { provide: Router, useValue: routerSpy },
            ],
        });

        guard = TestBed.inject(AuthGuard);
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should allow activation if user is logged in', (done: DoneFn) => {
        loggedInSubject.next(true);

        var canActivate = guard.canActivate() as Observable<boolean>;

        canActivate.subscribe((canActivate) => {
            expect(canActivate).toBeTrue();
            expect(router.navigate).not.toHaveBeenCalled();
            done();
        });
    });

    it('should prevent activation and navigate to /login if user is not logged in', (done: DoneFn) => {
        loggedInSubject.next(false);

        var canActivate = guard.canActivate() as Observable<boolean>;

        canActivate.subscribe((canActivate) => {
            expect(canActivate).toBeFalse();
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
            done();
        });
    });
});
