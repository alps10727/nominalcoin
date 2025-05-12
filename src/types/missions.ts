
import { ReactElement } from "react";

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string; // Changed from ReactElement to string to store the icon name
  progress: number;
  total: number;
  reward: number;
  claimed: boolean;
  lastClaimed?: number | null;
  cooldownEnd?: number | null;
  boostEndTime?: number | null;
  boostAmount?: number | null;
}

export interface WheelPrize {
  id: string;
  label: string;
  value: number;
  type: 'coins' | 'mining_rate';
  duration?: number; // ms cinsinden
}
