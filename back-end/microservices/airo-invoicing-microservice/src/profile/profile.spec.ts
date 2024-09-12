import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ProfileService } from './profile.service';
import { of } from 'rxjs';
import { createMockResponse, HttpServiceMock } from 'test/test-utils';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileService, HttpServiceMock],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserMailByUid', () => {
    it('should return the email of the user for a given uid', async () => {
      const mockResponse = createMockResponse({
        data: {
          email: 'test@example.com',
        },
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getUserMailByUid('123');

      expect(result).toEqual(mockResponse.data.email);

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.PROFILE_API_URL}/api/profile?uid=123`
      );
    });
  });
});
