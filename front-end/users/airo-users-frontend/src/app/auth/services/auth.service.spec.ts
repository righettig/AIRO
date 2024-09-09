import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../common/services/config.service';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let configServiceStub: Partial<ConfigService>;
  let httpClientStub: Partial<HttpClient>;
  
  beforeEach(async () => {
    configServiceStub = {
      config: { gatewayApiUrl: 'http://mock-api-url' }
    };

    httpClientStub = {};

    await TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: configServiceStub },
        { provide: HttpClient, useValue: httpClientStub },
      ]
    }).compileComponents();

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
