import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { createMockResponse, createMockHttpService } from 'airo-gateways-common';
import { CommandsService } from './commands.service';

describe('CommandsService', () => {
  let service: CommandsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandsService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<CommandsService>(CommandsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all commands', async () => {
      const commands = [{}];
      const mockResponse = createMockResponse(commands);

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service.getAll();

      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(`${service['serviceUrl']}/commands`);
    });
  });
});
