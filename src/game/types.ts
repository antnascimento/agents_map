import * as THREE from 'three';

export type FloorLevel = 1 | 2 | 3 | 4 | 5;

export interface FloorInfo {
  id?: number;
  level: FloorLevel;
  name: string;
  subtitle: string;
  elevationRange: [number, number];
  spawnPosition: [number, number, number];
  spawnPoint?: [number, number, number];
  color: string;
  themeColor?: string;
}

export interface PlayerTelemetry {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  speed: number;
  heading: number; // 0 - 360 degrees
  currentFloor: FloorLevel;
  floorName: string;
  isGrounded: boolean;
  isSprinting: boolean;
  isCrouching: boolean;
}

export interface AgentMessage {
  id: string;
  timestamp: string;
  sender: string;
  role: 'architect' | 'engineer' | 'commander' | 'system' | 'designer';
  badgeColor: string;
  content: string;
}

export type CommsMessage = AgentMessage;

export interface BuildingColliders {
  floors: THREE.Mesh[];
  ramps: THREE.Mesh[];
  walls: THREE.Box3[];
}

export interface NPCData {
  id: string;
  name: string;
  role: string;
  title?: string;
  type: 'human' | 'robot';
  floor: number;
  position: [number, number, number];
  dialogue: string[];
  lore: string;
  avatarColor: string;
  accentColor?: string;
  badge: string;
  mesh?: THREE.Group;
  distance?: number;
}

export type NPCInfo = NPCData;

export interface AgentOperationStatus {
  id: string;
  name: string;
  title: string;
  color: string;
  currentTask: string;
  status: 'active' | 'optimizing' | 'monitoring' | 'rendering';
  progress: number;
}

export interface DroneTelemetry {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  speedKmh: number;
  altitudeM: number;
  pitchDeg: number;
  rollDeg: number;
  headingDeg: number;
  distanceFromHelipadM: number;
  signalStrengthPct: number;
  batteryPct: number;
  isBoosting: boolean;
}
