import { Status } from './status.enum';

export type HardwareStatus = 'Running' | 'Failed' | 'Anomaly_detected';

export interface CommandHistoryItem {
  initiatedBy: string;
  timestamp: Date;
  description: string;
}

export interface AgentDetailsDto {
  id: string;
  name: string;
  batteryLevel: number;
  status: Status;

  general: {
    currentCommand: string;
    model: 'ANYmal' | 'ANYmal X';
    firmwareVersion: string;
    firmwareLastUpdated: Date;
    manualModeOn: boolean;
    location: { x: number; y: number; z: number };
    trekkerVersion: string;
    trekkerLastUpdated: Date;
  };

  hardware: {
    temperatureSensor: HardwareStatus;
    pressureSensor: HardwareStatus;
    leg1Status: HardwareStatus;
    leg2Status: HardwareStatus;
    leg3Status: HardwareStatus;
    leg4Status: HardwareStatus;
    gps: HardwareStatus;
    engine: HardwareStatus;
    battery: HardwareStatus;
    lidarScanner: HardwareStatus;
    wifi: HardwareStatus;
    lte: HardwareStatus;
    cpu1: HardwareStatus;
    cpu2: HardwareStatus;
    depthCameras: HardwareStatus[]; // Array for 6 cameras
    opticalCameras: HardwareStatus[]; // Array for 2 cameras
    thermalCamera: HardwareStatus;
    panTiltUnit: HardwareStatus;
    spotlight: HardwareStatus;
    ultrasonicMicrophone: HardwareStatus;
  };

  recentImages: string[]; // URLs or IDs of recent images
  commandHistory: CommandHistoryItem[]; // List of executed commands
  statusHistory: { timestamp: Date; status: string }[]; // History of status changes
}
