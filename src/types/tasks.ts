
export interface Task {
  id: string | number;
  title: string;
  description: string;
  reward: number;
  progress: number;
  totalRequired: number;
  completed: boolean;
  attachmentUrl?: string | null; // Yeni alan: dosya eki URL'si
  userId?: string;
}

export interface Badge {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
  earned: boolean;
  progress: number;
}
