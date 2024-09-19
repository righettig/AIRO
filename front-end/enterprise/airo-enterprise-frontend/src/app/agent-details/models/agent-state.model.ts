import { Vector3 } from "@babylonjs/core";
import { Status } from "../../agents/models/status.enum";

export interface AgentState {
    name: string;
    position: Vector3;
    batteryLevel: number;
    status: Status;
}