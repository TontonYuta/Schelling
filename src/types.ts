export type AgentType = 'RED' | 'BLUE';
export type SimulationMode = 'CONTINUOUS' | 'GRID' | 'DUAL' | 'APPLICATIONS' | 'STATISTICS' | 'ALGORITHM';

export interface HistoryPoint {
  iteration: number;
  unhappyCount: number;
  happiness: number;
  calcTime: number;
  mode: 'CONTINUOUS' | 'GRID';
}

export interface ComparisonResult {
  iterations: number;
  finalHappiness: number;
  agentCount: number;
  avgCalcTime: number;
}

export interface Agent {
  id: number;
  x: number;
  y: number;
  type: AgentType;
  happy: boolean;
}

export interface SimulationState {
  iterations: { continuous: number; grid: number };
  unhappyCount: { continuous: number; grid: number };
  isRunning: { continuous: boolean; grid: boolean };
}
