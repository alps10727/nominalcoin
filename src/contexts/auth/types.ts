
import { User } from "@supabase/supabase-js";
import { UserData } from "@/utils/storage";

export interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<boolean>;
  userData: UserData | null;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  isOffline: boolean;
  dataSource: 'supabase' | 'cache' | 'local' | null;
}

