import { Test, TestingModule } from '@nestjs/testing';
import { GatewayController } from './gateway.controller';
import { AuthService } from 'src/auth/auth.service';
import { MissionsService } from 'src/missions/missions.service';
import { CommandsService } from 'src/commands/commands.service';
import { AgentsService } from 'src/agents/agents.service';
import { CreateMissionDto } from './models/create-mission.dto';
import { ExecuteMissionDto } from './models/execute-mission.dto';
import { LoginDto } from './models/login.dto';
import { LoginResponseDto } from './models/login.response.dto';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';

describe('GatewayController', () => {
  let controller: GatewayController;
  let authService: AuthService;
  let missionsService: MissionsService;
  let commandsService: CommandsService;
  let agentsService: AgentsService;
  let leaderboardService: LeaderboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GatewayController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            logout: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
        {
          provide: MissionsService,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
            execute: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CommandsService,
          useValue: {
            getAll: jest.fn(),
          },
        },
        {
          provide: AgentsService,
          useValue: {
            get: jest.fn(),
            getCommandsHistoryByAgentId: jest.fn(),
            getAll: jest.fn(),
            executeCommand: jest.fn(),
          },
        },
        {
          provide: LeaderboardService,
          useValue: {
          },
        },
      ],
    }).compile();

    controller = module.get<GatewayController>(GatewayController);
    authService = module.get<AuthService>(AuthService);
    missionsService = module.get<MissionsService>(MissionsService);
    commandsService = module.get<CommandsService>(CommandsService);
    agentsService = module.get<AgentsService>(AgentsService);
    leaderboardService = module.get<LeaderboardService>(LeaderboardService);
  });

  describe('login', () => {
    it('should return a login response', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password' };
      const loginResponse: LoginResponseDto = { uid: '123', token: 'abc' };
      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(result).toEqual(loginResponse);
    });
  });

  describe('logout', () => {
    it('should call authService.logout', async () => {
      await controller.logout();
      expect(authService.logout).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should return a refreshed token', async () => {
      const refreshTokenResponse = { token: 'newToken' };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(refreshTokenResponse);

      const result = await controller.refreshToken();

      expect(authService.refreshToken).toHaveBeenCalled();
      expect(result).toEqual(refreshTokenResponse);
    });
  });

  describe('getAgent', () => {
    it('should return an agent by agentId', async () => {
      const agentId = 'agent123';
      const agent = { id: agentId, name: 'Agent Name' };
      jest.spyOn(agentsService, 'get').mockResolvedValue(agent);

      const result = await controller.getAgent(agentId);

      expect(agentsService.get).toHaveBeenCalledWith(agentId);
      expect(result).toEqual(agent);
    });
  });

  describe('getAgentCommands', () => {
    it('should return command history for the agent', async () => {
      const agentId = 'agent123';
      const commands = [{ id: 'command1' }, { id: 'command2' }];
      jest.spyOn(agentsService, 'getCommandsHistoryByAgentId').mockResolvedValue(commands);

      const result = await controller.getAgentCommands(agentId);

      expect(agentsService.getCommandsHistoryByAgentId).toHaveBeenCalledWith(agentId);
      expect(result).toEqual(commands);
    });
  });

  describe('getAllAgents', () => {
    it('should return all agents', async () => {
      const agents = [{ id: 'agent1' }, { id: 'agent2' }];
      jest.spyOn(agentsService, 'getAll').mockResolvedValue(agents);

      const result = await controller.getAllAgents();

      expect(agentsService.getAll).toHaveBeenCalled();
      expect(result).toEqual(agents);
    });
  });

  describe('executeCommand', () => {
    it('should execute a command on the agent', async () => {
      const agentId = 'agent123';
      const command = 'some-command';
      const data = { key: 'value' };
      const commandResponse = { result: 'command executed' };
      jest.spyOn(agentsService, 'executeCommand').mockResolvedValue(commandResponse);

      const result = await controller.executeCommand(agentId, command, data);

      expect(agentsService.executeCommand).toHaveBeenCalledWith(agentId, command, data);
      expect(result).toEqual(commandResponse);
    });
  });

  describe('getAllCommands', () => {
    it('should return all commands', async () => {
      const commands = [{ id: 'command1' }, { id: 'command2' }];
      jest.spyOn(commandsService, 'getAll').mockResolvedValue(commands);

      const result = await controller.getAllCommands();

      expect(commandsService.getAll).toHaveBeenCalled();
      expect(result).toEqual(commands);
    });
  });

  describe('getAllMissions', () => {
    it('should return all missions', async () => {
      const missions = [{ id: 'mission1' }, { id: 'mission2' }];
      jest.spyOn(missionsService, 'getAll').mockResolvedValue(missions);

      const result = await controller.getAllMissions();

      expect(missionsService.getAll).toHaveBeenCalled();
      expect(result).toEqual(missions);
    });
  });

  describe('createMission', () => {
    it('should create a new mission', async () => {
      const createMissionDto: CreateMissionDto = { name: 'New Mission', commands: ['command1'] };
      jest.spyOn(missionsService, 'create').mockResolvedValue('mission1');

      const result = await controller.createMission(createMissionDto);

      expect(missionsService.create).toHaveBeenCalledWith(createMissionDto.name, createMissionDto.commands);
      expect(result).toEqual('mission1');
    });
  });

  describe('executeMission', () => {
    it('should execute a mission for the agent', async () => {
      const executeMissionDto: ExecuteMissionDto = { agentId: 'agent123', missionId: 'mission1' };
      jest.spyOn(missionsService, 'execute');

      const result = await controller.executeMission(executeMissionDto);

      expect(missionsService.execute).toHaveBeenCalledWith(executeMissionDto.agentId, executeMissionDto.missionId);
    });
  });

  describe('deleteMission', () => {
    it('should delete a mission by missionId', async () => {
      const missionId = 'mission1';
      jest.spyOn(missionsService, 'delete');

      const result = await controller.deleteMission(missionId);

      expect(missionsService.delete).toHaveBeenCalledWith(missionId);
    });
  });
});
