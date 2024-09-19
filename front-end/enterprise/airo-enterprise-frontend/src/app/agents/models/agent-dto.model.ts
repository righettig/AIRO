import { Status } from "./status.enum";

export interface AgentDto {
  id: string;
  name: string;
  batteryLevel: number;
  status: Status;
}
