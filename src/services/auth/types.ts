
import { User } from "firebase/auth";

export interface UserRegistrationData {
  name?: string;
  emailAddress?: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User | null;
  error?: Error;
}
