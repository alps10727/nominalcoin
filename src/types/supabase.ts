
/**
 * Custom type definitions for Supabase RPC functions
 */

export interface RPCFunctions {
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
}

// Export Database schema types for profiles and other tables
export type ProfileRow = {
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
  // Add other profile fields as needed
};
