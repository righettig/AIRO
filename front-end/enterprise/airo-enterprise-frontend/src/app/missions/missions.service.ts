import { Injectable } from '@angular/core';
import { HttpService } from '../common/services/http.service';
import { ConfigService } from '../common/services/config.service';
import { Mission } from './models/mission.model';

@Injectable({
  providedIn: 'root',
})
export class MissionsService {
  get baseUrl(): string {
    return `${this.configService.config.gatewayApiUrl}/gateway`;
  }

  private commandsApiUrl = `${this.baseUrl}/commands`;
  private missionsApiUrl = `${this.baseUrl}/missions`;

  constructor(private configService: ConfigService, private http: HttpService) {}

  async getCommands(): Promise<string[]> {
    const response = await this.http.get<string[]>(this.commandsApiUrl);
    return response;
  }

  async getMissions(): Promise<Mission[]> {
    const response = await this.http.get<Mission[]>(this.missionsApiUrl);
    return response;
  }

  async createMission(mission: Mission): Promise<Mission> {
    const response = await this.http.fetch<Mission>(this.missionsApiUrl + '/create', {
      method: 'POST',
      body: JSON.stringify(mission),
    });
    return response;
  }

  async deleteMission(missionid: string): Promise<void> {
    await this.http.fetch(this.missionsApiUrl + `?missionId=${missionid}`, {
      method: 'DELETE',
    });
  }

  async executeMission(agentId: string, missionId: string): Promise<void> {
    await this.http.fetch(this.missionsApiUrl + '/execute', {
      method: 'POST',
      body: JSON.stringify({ agentId, missionId }),
    });
  }
}
