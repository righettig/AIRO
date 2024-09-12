import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { ProfileService } from '../profile/profile.service';
import { BillingService } from '../billing/billing.service';
import { InvoiceService } from '../invoice/invoice.service';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './models/login.dto';
import { SignupDto } from './models/signup.dto';
import { UpdateProfileDto } from 'src/profile/models/update-profile-dto';

describe('GatewayController', () => {
  let controller: GatewayController;
  let authService: AuthService;
  let profileService: ProfileService;
  let billingService: BillingService;
  let invoiceService: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            refreshToken: jest.fn(),
            getUserRole: jest.fn(),
          },
        },
        {
          provide: ProfileService,
          useValue: {
            createProfile: jest.fn(),
            getProfileByUid: jest.fn(),
            updateProfileByUid: jest.fn(),
          },
        },
        {
          provide: BillingService,
          useValue: {
            processPayment: jest.fn(),
          },
        },
        {
          provide: InvoiceService,
          useValue: {
            getAllInvoicesByUid: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    authService = module.get<AuthService>(AuthService);
    profileService = module.get<ProfileService>(ProfileService);
    billingService = module.get<BillingService>(BillingService);
    invoiceService = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signup and profileService.createProfile', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
        accountType: 'basic',
        creditCardDetails: '1234-5678-9101',
      };
      const signupResponse = { uid: '123', token: 'jwt-token' };
      jest.spyOn(authService, 'signup').mockResolvedValue(signupResponse);
      jest.spyOn(profileService, 'createProfile').mockResolvedValue(undefined);

      const result = await controller.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto.email, signupDto.password);
      expect(profileService.createProfile).toHaveBeenCalledWith(signupResponse.uid, signupDto.accountType, signupDto.email);
      expect(result).toEqual({
        uid: signupResponse.uid,
        token: signupResponse.token,
        firstName: '',
        lastName: '',
        accountType: signupDto.accountType,
      });
    });

    it('should call billingService.processPayment for pro accounts', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
        accountType: 'pro',
        creditCardDetails: '1234-5678-9101',
      };
      const signupResponse = { uid: '123', token: 'jwt-token' };
      const paymentResponse = { success: true };
      jest.spyOn(authService, 'signup').mockResolvedValue(signupResponse);
      jest.spyOn(billingService, 'processPayment').mockResolvedValue(paymentResponse);

      const result = await controller.signup(signupDto);

      expect(billingService.processPayment).toHaveBeenCalledWith(signupResponse.uid, signupDto.creditCardDetails);
      expect(result).toEqual({
        uid: signupResponse.uid,
        token: signupResponse.token,
        firstName: '',
        lastName: '',
        accountType: signupDto.accountType,
      });
    });

    it('should throw an error if payment fails for pro accounts', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'password',
        accountType: 'pro',
        creditCardDetails: '1234-5678-9101',
      };
      const signupResponse = { uid: '123', token: 'jwt-token' };
      const paymentResponse = { success: false };
      jest.spyOn(authService, 'signup').mockResolvedValue(signupResponse);
      jest.spyOn(billingService, 'processPayment').mockResolvedValue(paymentResponse);

      await expect(controller.signup(signupDto)).rejects.toThrow('Signup failed: subscription payment failed.');
    });
  });

  describe('login', () => {
    it('should call authService.login and profileService.getProfileByUid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const loginResponse = { uid: '123', token: 'jwt-token' };
      const profileResponse = { uid: '123', firstName: 'John', lastName: 'Doe', accountType: 'basic' };

      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);
      jest.spyOn(profileService, 'getProfileByUid').mockResolvedValue(profileResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(profileService.getProfileByUid).toHaveBeenCalledWith(loginResponse.uid);
      expect(result).toEqual({
        uid: loginResponse.uid,
        token: loginResponse.token,
        firstName: profileResponse.firstName,
        lastName: profileResponse.firstName,
        accountType: profileResponse.accountType,
      });
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      await controller.logout();

      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken', async () => {
      const refreshTokenResponse = { token: 'new-jwt-token' };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(refreshTokenResponse);

      const result = await controller.refreshToken();

      expect(authService.refreshToken).toHaveBeenCalled();
      expect(result).toEqual(refreshTokenResponse);
    });
  });

  describe('getUser', () => {
    it('should return user data from token and services', async () => {
      const mockRequest = { headers: { authorization: 'Bearer jwt-token' } } as any;
      jest.spyOn(controller as any, 'decodeFromToken').mockReturnValue('123');
      const userResponse = { uid: '123', firstName: 'John', lastName: 'Doe', accountType: 'basic' };
      const userRoleResponse = { role: 'admin' };

      jest.spyOn(profileService, 'getProfileByUid').mockResolvedValue(userResponse);
      jest.spyOn(authService, 'getUserRole').mockResolvedValue(userRoleResponse);

      const result = await controller.getUser(mockRequest);

      expect(profileService.getProfileByUid).toHaveBeenCalledWith('123');
      expect(authService.getUserRole).toHaveBeenCalledWith(expect.any(String));
      expect(result).toEqual({ ...userResponse, ...userRoleResponse });
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile successfully', async () => {
      const mockRequest = { headers: { authorization: 'Bearer jwt-token' } } as any;
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const uid = '123';
      const userResponse = { uid, firstName: 'John', lastName: 'Doe', accountType: 'basic' };
  
      jest.spyOn(controller as any, 'decodeFromToken').mockReturnValue(uid);
      jest.spyOn(profileService, 'updateProfileByUid').mockResolvedValue(userResponse);
  
      const result = await controller.updateProfile(mockRequest, updateProfileDto);
  
      expect(profileService.updateProfileByUid).toHaveBeenCalledWith(uid, updateProfileDto.firstName, updateProfileDto.lastName);
      expect(result).toEqual(userResponse);
    });
  
    it('should throw an error if the token is missing', async () => {
      const mockRequest = { headers: {} } as any;
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'John',
        lastName: 'Doe',
      };
  
      await expect(controller.updateProfile(mockRequest, updateProfileDto)).rejects.toThrow('Token is missing');
    });
  }); 

  describe('getAllInvoices', () => {
    it('should return all invoices for the user', async () => {
      const mockRequest = { headers: { authorization: 'Bearer jwt-token' } } as any;
      jest.spyOn(controller as any, 'decodeFromToken').mockReturnValue('123');
      const invoicesResponse = [
        { uid: 'invoice1', amount: 100, createdAt: new Date() }, 
        { uid: 'invoice2', amount: 200, createdAt: new Date() }
      ];

      jest.spyOn(invoiceService, 'getAllInvoicesByUid').mockResolvedValue(invoicesResponse);

      const result = await controller.getAllInvoices(mockRequest);

      expect(invoiceService.getAllInvoicesByUid).toHaveBeenCalledWith('123');
      expect(result).toEqual(invoicesResponse);
    });
  });
});
