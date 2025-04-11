
export interface MiningState {
  isLoading: boolean;
  miningActive: boolean;
  progress: number;
  balance: number;
  miningRate: number;
  miningSession: number;
  miningTime: number;
  miningPeriod: number; // Toplam madencilik periyodu (sn olarak)
  userId?: string; // Optional user ID
  miningEndTime?: number; // Added absolute timestamp for mining end time
}

export interface MiningActions {
  handleStartMining: () => void;
  handleStopMining: () => void;
}

export type MiningData = MiningState & MiningActions & {
  isOffline?: boolean; // Added isOffline property
};
