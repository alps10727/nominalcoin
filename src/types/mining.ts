
export interface MiningState {
  isLoading: boolean;
  miningActive: boolean;
  progress: number;
  balance: number;
  miningRate: number;
  miningSession: number;
  miningTime: number;
  miningPeriod: number; // Toplam madencilik periyodu (sn olarak)
}

export interface MiningActions {
  handleStartMining: () => void;
  handleStopMining: () => void;
}

export type MiningData = MiningState & MiningActions;
