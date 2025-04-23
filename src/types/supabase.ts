
/**
 * Custom type definitions for Supabase RPC functions and database schema
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          referral_code?: string | null;
          referral_count?: number | null;
          referrals?: string[] | null;
          balance?: number | undefined;
          mining_rate?: number | undefined;
          name?: string | null;
          email?: string | null;
          invited_by?: string | null;
          created_at?: string | null;
        };
        Insert: {
          id: string;
          referral_code?: string | null;
          referral_count?: number | null;
          referrals?: string[] | null;
          balance?: number | undefined;
          mining_rate?: number | undefined;
          name?: string | null;
          email?: string | null;
          invited_by?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          referral_code?: string | null;
          referral_count?: number | null;
          referrals?: string[] | null;
          balance?: number | undefined;
          mining_rate?: number | undefined;
          name?: string | null;
          email?: string | null;
          invited_by?: string | null;
          created_at?: string | null;
        };
      };
    };
    Functions: {
      process_referral: {
        Args: {
          p_referrer_id: string;
          p_new_user_id: string;
          p_referral_code: string;
        };
        Returns: boolean;
      };
      
      update_user_balance: {
        Args: {
          p_user_id: string;
          p_amount: number;
          p_reason: string;
        };
        Returns: boolean;
      };
    };
    Views: {};
    CompositeTypes: {};
  };
}

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type RPCFunctions = Database['public']['Functions'];
