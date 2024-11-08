import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { createMockHttpService } from 'airo-gateways-common';
import { BotBehaviourCompilerService } from './bot-behaviour-compiler.service';

describe('BotBehaviourCompilerService', () => {
  let service: BotBehaviourCompilerService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotBehaviourCompilerService,
        createMockHttpService(HttpService)
      ],
    }).compile();

    service = module.get<BotBehaviourCompilerService>(BotBehaviourCompilerService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
