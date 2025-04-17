
import { Timestamp } from "firebase/firestore";

export interface PoolRequirements {
  miningDays: number;
  minBalance: number;
}

export interface MiningPool {
  poolId: string;
  name: string;
  owner: string;
  level: number;
  memberCount: number;
  minRequirements: PoolRequirements;
  createdAt: Timestamp | null;
  description?: string;
  imageUrl?: string;
  capacity?: number;
  isPublic?: boolean;
  minRank?: string; // Added minimum rank requirement
}

export interface PoolMembership {
  currentPool: string | null;
  joinDate: string | null;
  lastPoolChangeDate?: string | null;
}

export enum MemberRank {
  ROOKIE = "Çaylak",   // 0-30 days
  MINER = "Madenci",   // 31-100 days
  LEADER = "Lider"     // 101+ days
}

export interface MiningStats {
  totalDays: number;
  dailyAverage: number;
  rank?: MemberRank;
}
