import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ConfigService } from './config.service';

export interface Mission {
  id?: string;
  name: string;
  commands: string[];
}

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
    const response = await this.http.fetch(this.commandsApiUrl, {
      method: 'GET',
    });
    return response.json();
  }

  async getMissions(): Promise<Mission[]> {
    const response = await this.http.fetch(this.missionsApiUrl, {
      method: 'GET',
    });
    return response.json();
  }

  async createMission(mission: Mission): Promise<Mission> {
    const response = await this.http.fetch(this.missionsApiUrl + '/create', {
      method: 'POST',
      body: JSON.stringify(mission),
    });
    return response.json();
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
