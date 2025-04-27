export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  totalRequired: number;
  completed: boolean;
  attachmentUrl?: string | null;
  userId?: string;
  createdAt?: string;
}

export interface Badge {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  earned: boolean;
  progress: number;
}
