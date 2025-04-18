
-- Referral transaction stored procedure
CREATE OR REPLACE FUNCTION public.process_referral_transaction(p_code TEXT, p_new_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_owner_id UUID;
  v_code_id UUID;
  v_already_processed BOOLEAN;
  v_result JSONB;
BEGIN
  -- Check if code exists and is not used
  SELECT id, owner INTO v_code_id, v_owner_id
  FROM public.referral_codes
  WHERE code = p_code
    AND (used IS NULL OR used = false)
  LIMIT 1;
  
  IF v_owner_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Invalid or used referral code'
    );
  END IF;
  
  -- Check if this user already processed a referral
  SELECT EXISTS(
    SELECT 1 FROM public.profiles
    WHERE id = p_new_user_id
      AND invited_by IS NOT NULL
  ) INTO v_already_processed;
  
  IF v_already_processed THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'User has already used a referral code'
    );
  END IF;
  
  -- Check for self-referral
  IF v_owner_id = p_new_user_id THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Cannot use your own referral code'
    );
  END IF;
  
  -- Mark code as used
  UPDATE public.referral_codes
  SET 
    used = true,
    used_by = p_new_user_id,
    used_at = NOW()
  WHERE id = v_code_id;
  
  -- Update referrer (add the referred user to their list)
  WITH referrer_data AS (
    SELECT 
      mining_rate,
      referral_count,
      referrals
    FROM public.profiles
    WHERE id = v_owner_id
  )
  UPDATE public.profiles
  SET 
    referral_count = COALESCE(referral_count, 0) + 1,
    referrals = CASE
      WHEN referrals IS NULL THEN ARRAY[p_new_user_id::TEXT]
      ELSE array_append(referrals, p_new_user_id::TEXT)
    END,
    mining_rate = COALESCE(mining_rate, 0.003) + 0.003
  WHERE id = v_owner_id;
  
  -- Update invitee to record who invited them
  UPDATE public.profiles
  SET invited_by = v_owner_id
  WHERE id = p_new_user_id;
  
  -- Create audit log record
  INSERT INTO public.referral_audit (
    referrer_id, 
    invitee_id, 
    code, 
    code_id
  ) VALUES (
    v_owner_id,
    p_new_user_id,
    p_code,
    v_code_id
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'referrer_id', v_owner_id,
    'invitee_id', p_new_user_id
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', 'Transaction error: ' || SQLERRM
  );
END;
$$;
