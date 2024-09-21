import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMockResponse, HttpServiceMock } from 'test/test-utils';
import { MissionsService } from './missions.service';

describe('MissionsService', () => {
  let service: MissionsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MissionsService,
        HttpServiceMock
      ],
    }).compile();

    service = module.get<MissionsService>(MissionsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all missions', async () => {
      const missions = [{}];
      const mockResponse = createMockResponse(missions);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getAll();

      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/missions`);
    });
  });

  describe('delete', () => {
    it('should send a DELETE request to remove a mission', async () => {
      const mockResponse = createMockResponse(undefined);
      jest.spyOn(httpService, 'delete').mockReturnValue(of(mockResponse));

      await service.delete('123');

      expect(httpService.delete).toHaveBeenCalledWith(`${service['serviceUrl']}/missions?missionId=123`);
    });
  });

  describe('create', () => {
    it('should send a POST request to create a mission and return its id', async () => {
      const missionId = 'mission-id';
      const mockResponse = createMockResponse(missionId);
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.create('Mission Name', ['c1', 'c2', 'c3']);

      expect(result).toEqual('mission-id');
      expect(httpService.post).toHaveBeenCalledWith(`${service['serviceUrl']}/missions/create`, {
        id: '',
        name: 'Mission Name',
        commands: ['c1', 'c2', 'c3']
      });
    });
  });

  describe('execute', () => {
    it('should send a POST request to execute a mission', async () => {
      const mockResponse = createMockResponse({});
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.execute('agentId', 'missionId');

      expect(httpService.post).toHaveBeenCalledWith(`${service['serviceUrl']}/missions/execute`, {
        agentId: 'agentId',
        missionId: 'missionId'
      });
    });
  });
});
