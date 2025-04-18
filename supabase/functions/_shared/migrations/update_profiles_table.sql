
-- Add referral related columns to profiles table if they don't exist

DO $$
BEGIN
  -- Add referral_code column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN referral_code TEXT;
  END IF;
  
  -- Add referral_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'referral_count'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN referral_count INTEGER DEFAULT 0;
  END IF;
  
  -- Add referrals array column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'referrals'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN referrals TEXT[] DEFAULT '{}';
  END IF;
  
  -- Add invited_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'invited_by'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN invited_by UUID REFERENCES public.profiles(id);
  END IF;
END $$;

-- Create referral_audit table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.referral_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.profiles(id),
  invitee_id UUID REFERENCES public.profiles(id),
  code TEXT NOT NULL,
  code_id UUID REFERENCES public.referral_codes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
