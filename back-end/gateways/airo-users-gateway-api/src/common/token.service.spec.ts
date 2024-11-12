import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { jwtDecode } from 'jwt-decode';

// Mock jwt-decode
jest.mock('jwt-decode');

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  describe('getTokenFromRequest', () => {
    it('should return token when authorization header is present', () => {
      const mockRequest = {
        headers: {},
      } as Request;

      mockRequest.headers['authorization'] = 'Bearer token123';

      expect(service.getTokenFromRequest(mockRequest)).toBe('Bearer token123');
    });

    it('should throw error when authorization header is missing', () => {
      const mockRequest = {
        headers: {},
      } as Request;

      expect(() => service.getTokenFromRequest(mockRequest)).toThrow('Token is missing');
    });
  });

  describe('decodeFromToken', () => {
    interface MockTokenPayload {
      userId: string;
      email: string;
      role: string;
    }

    const mockToken = 'valid.jwt.token';
    const mockDecodedToken: MockTokenPayload = {
      userId: '123',
      email: 'test@example.com',
      role: 'admin',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return property value when token is valid and property exists', () => {
      (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

      const result = service.decodeFromToken<MockTokenPayload>(mockToken, 'userId');
      expect(result).toBe('123');
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    it('should return null when property does not exist in decoded token', () => {
      (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

      const result = service.decodeFromToken<MockTokenPayload>(mockToken, 'nonexistent' as keyof MockTokenPayload);
      expect(result).toBeNull();
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    it('should return null when token decoding fails', () => {
      (jwtDecode as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = service.decodeFromToken<MockTokenPayload>(mockToken, 'userId');
      
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Error decoding token:', expect.any(Error));
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);

      consoleSpy.mockRestore();
    });

    it('should handle different property types correctly', () => {
      const mockTokenWithDifferentTypes = {
        stringProp: 'string',
        numberProp: 42,
        booleanProp: true,
        objectProp: { key: 'value' },
      };

      (jwtDecode as jest.Mock).mockReturnValue(mockTokenWithDifferentTypes);

      expect(service.decodeFromToken(mockToken, 'stringProp')).toBe('string');
      expect(service.decodeFromToken(mockToken, 'numberProp')).toBe(42);
      expect(service.decodeFromToken(mockToken, 'booleanProp')).toBe(true);
      expect(service.decodeFromToken(mockToken, 'objectProp')).toEqual({ key: 'value' });
    });
  });
});