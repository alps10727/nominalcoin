
export interface Task {
  id: string | number;
  title: string;
  description: string;
  reward: number;
  progress: number;
  totalRequired: number;
  completed: boolean;
}

export interface Badge {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  earned: boolean;
  progress: number;
}
