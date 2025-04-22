
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
