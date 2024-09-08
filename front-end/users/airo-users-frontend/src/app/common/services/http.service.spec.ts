import { TestBed } from '@angular/core/testing';
import { HttpService } from './http.service';
import { AuthService } from '../../auth/services/auth.service';

describe('HttpService', () => {
  let service: HttpService;
  let authServiceStub: any;

  beforeEach(() => {
    authServiceStub = {};

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceStub },
      ]
    });
    service = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
