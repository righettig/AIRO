import { All, Body, Controller, Delete, Get, Logger, Param, Post, Req, Res } from "@nestjs/common";
import { MissionsService } from "src/missions/missions.service";
import { CreateMissionDto } from "./models/create-mission.dto";
import { ExecuteMissionDto } from "./models/execute-mission.dto";
import { CommandsService } from "src/commands/commands.service";
import { AgentsService } from "src/agents/agents.service";
import { AuthService } from "src/auth/auth.service";
import { LoginDto } from "./models/login.dto";
import { LoginResponseDto } from "./models/login.response.dto";

@Controller('gateway')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly missionsService: MissionsService,
    private readonly commandsService: CommandsService,
    private readonly agentsService: AgentsService,
  ) { } 

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const loginResponse = await this.authService.login(loginDto.email, loginDto.password);

    const response: LoginResponseDto = {
      uid: loginResponse.uid,
      token: loginResponse.token,
    }

    return response;
  }

  @Post('logout')
  async logout() {
    await this.authService.logout();
  }

  @Post('refresh-token')
  async refreshToken() {
    const response = await this.authService.refreshToken();
    return response;
  }

  @Get('agents/:agentId')
  async getAgent(@Param('agentId') agentId: string) {
    const response = await this.agentsService.get(agentId);
    return response;
  }

  @Get('agents/:agentId/commands')
  async getAgentCommands(@Param('agentId') agentId: string) {
    const response = await this.agentsService.getCommandsHistoryByAgentId(agentId);
    return response;
  }

  @Get('agents')
  async getAllAgents() {
    const response = await this.agentsService.getAll();
    return response;
  }

  @All('agents/:agentId/:command')
  async executeCommand(
    @Param('agentId') agentId: string,
    @Param('command') command: string,
    @Body() data: any
  ) {
    const response = await this.agentsService.executeCommand(agentId, command, data);
    return response;
  }

  @Get('commands')
  async getAllCommands() {
    const response = await this.commandsService.getAll();
    return response;
  }

  @Get('missions')
  async getAllMissions() {
    const response = await this.missionsService.getAll();
    return response;
  }

  @Post('missions')
  async createMission(@Body() createMissionDto: CreateMissionDto) {
    const response = await this.missionsService.create(createMissionDto.name, createMissionDto.commands);
    return response;
  }

  @Post('missions/execute')
  async executeMission(@Body() executeMissionDto: ExecuteMissionDto) {
    const response = await this.missionsService.execute(executeMissionDto.agentId, executeMissionDto.missionId);
    return response;
  }

  @Delete('missions/:missionId')
  async deleteMission(@Param('missionId') missionId: string) {
    const response = await this.missionsService.delete(missionId);
    return response;
  }
}
