
import { User } from "@supabase/supabase-js";

export interface UserRegistrationData {
  name?: string;
  emailAddress?: string;
  referralCode?: string | null;
  [key: string]: any; // Allows for additional fields
}

export interface AuthResponse {
  user: User | null;
  error?: Error;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Sanitized user data for safe storage
export interface SanitizedUserData {
  id: string;
  email: string;
  name?: string;
  lastLogin: number;
  isVerified: boolean;
}

// References for HTTP security headers
export const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
};
