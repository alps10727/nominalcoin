
import { ReactElement } from "react";

export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: ReactElement;
  progress: number;
  total: number;
  reward: number;
  claimed: boolean;
}
