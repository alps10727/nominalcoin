
import { User } from '@supabase/supabase-js';

export interface UserRegistrationData {
  name?: string;
  emailAddress?: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User | null;
  error?: Error;
}
