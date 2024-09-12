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

  describe('createProfile', () => {
    it('should call the create profile API with the correct parameters', async () => {
      jest.spyOn(httpService, 'post').mockReturnValue(of(null));

      await service.createProfile('123', 'user', 'test@example.com', 'fake-card-details');

      expect(httpService.post).toHaveBeenCalledWith(
        `${process.env.PROFILE_API_URL}/api/profile`,
        {
          uid: '123',
          accountType: 'user',
          email: 'test@example.com',
          creditCardDetails: 'fake-card-details',
        }
      );
    });
  });

  describe('getProfileByUid', () => {
    it('should return the profile for a given uid', async () => {
      const mockProfileResponse = createMockResponse({
        data: {
          uid: '123',
          firstName: 'John',
          lastName: 'Doe',
          accountType: 'user',
        },
      });

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockProfileResponse));

      const result = await service.getProfileByUid('123');

      expect(result).toEqual(mockProfileResponse.data);

      expect(httpService.get).toHaveBeenCalledWith(
        `${process.env.PROFILE_API_URL}/api/profile?uid=123`
      );
    });
  });
});