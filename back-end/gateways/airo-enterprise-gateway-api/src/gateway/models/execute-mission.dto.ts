import { IsNotEmpty } from 'class-validator';

export class ExecuteMissionDto {
    @IsNotEmpty({ message: 'AgentId is required' })
    agentId: string;

    @IsNotEmpty({ message: 'MissionId is required' })
    missionId: string;
}