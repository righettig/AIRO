import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMockResponse, HttpServiceMock } from 'test/test-utils';
import { AgentsService } from './agents.service';

describe('AgentsService', () => {
  let service: AgentsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentsService,
        HttpServiceMock
      ],
    }).compile();

    service = module.get<AgentsService>(AgentsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('executeCommand', () => {
    it('should post data to the correct URL with non-empty data', async () => {
      const agentId = '123';
      const command = 'test-command';
      const data = { some: 'data' };
      const mockResponse = createMockResponse({ data: 'response-data' });

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.executeCommand(agentId, command, data);

      // Assertions
      expect(httpService.post).toHaveBeenCalledWith(
        `${service['serviceUrl']}/anymal/${command}`,
        data,
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should stringify agentId when data is empty', async () => {
      const agentId = '123';
      const command = 'test-command';
      const data = {};
      const mockResponse = createMockResponse({ data: 'response-data' });

      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));

      const result = await service.executeCommand(agentId, command, data);

      // Assertions
      expect(httpService.post).toHaveBeenCalledWith(
        `${service['serviceUrl']}/anymal/${command}`,
        JSON.stringify(agentId),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getCommandsHistoryByAgentId', () => {
    it('should return an agent by id', async () => {
      const data = {};
      const mockResponse = createMockResponse(data);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getCommandsHistoryByAgentId('agent-1');

      expect(result).toEqual(data);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/anymal?id=agent-1/commands`);
    });
  });

  describe('getById', () => {
    it('should return an agent by id', async () => {
      const agent = { id: 'agent-1' };
      const mockResponse = createMockResponse(agent);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.get('agent-1');

      expect(result).toEqual(agent);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/anymal?id=agent-1`);
    });
  });

  describe('getAll', () => {
    it('should return all agents', async () => {
      const agents = [{ id: 'agent-1' }, { id: 'agent-2' }];
      const mockResponse = createMockResponse(agents);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getAll();

      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/anymal`);
    });
  });
});
