
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Constants
const REFERRAL_BONUS_RATE = 0.003;  // Mining rate bonus for referrer
const REFERRAL_TOKEN_REWARD = 10;   // Token reward for invited user

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { code, newUserId } = await req.json()
    
    if (!code || !newUserId) {
      throw new Error('Referral code and new user ID are required')
    }

    // Create Supabase client with service role for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase()
    console.log(`Processing referral code: ${normalizedCode} for user: ${newUserId}`);

    // First try to find the referrer by referral_code in profiles
    const { data: referrerData, error: referrerError } = await supabaseAdmin
      .from('profiles')
      .select('id, mining_rate, referral_count, referrals')
      .eq('referral_code', normalizedCode)
      .maybeSingle()
      
    if (referrerError) {
      console.error('Error finding referrer:', referrerError)
      throw new Error(`Failed to find referrer: ${referrerError.message}`)
    }
    
    if (!referrerData) {
      throw new Error('Referral code owner not found')
    }
    
    const referrerId = referrerData.id
    console.log(`Referrer found: ${referrerId}`);
    
    // Make sure it's not self-referral
    if (referrerId === newUserId) {
      throw new Error('Cannot use your own referral code')
    }
    
    // Check if referral already exists
    const referrals = referrerData.referrals || []
    if (referrals.includes(newUserId)) {
      console.log('Referral already processed, skipping')
      return new Response(
        JSON.stringify({ success: true, result: 'already_processed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Apply rewards to both parties using transactions for data consistency
    try {
      // 1. Update referrer - add mining rate and referral count
      const currentMiningRate = referrerData.mining_rate || 0.003
      const newMiningRate = parseFloat((currentMiningRate + REFERRAL_BONUS_RATE).toFixed(4))
      const { error: updateReferrerError } = await supabaseAdmin
        .from('profiles')
        .update({
          mining_rate: newMiningRate,
          referral_count: (referrerData.referral_count || 0) + 1,
          referrals: [...referrals, newUserId]
        })
        .eq('id', referrerId)
        
      if (updateReferrerError) {
        throw updateReferrerError
      }
      
      console.log(`Successfully updated referrer (${referrerId}) with new mining rate: ${newMiningRate}`);
      
      // 2. Update new user - add tokens and set invited_by
      const { data: newUserData, error: newUserError } = await supabaseAdmin
        .from('profiles')
        .select('balance')
        .eq('id', newUserId)
        .maybeSingle()
        
      if (newUserError) {
        throw newUserError
      }
      
      if (!newUserData) {
        // If profile doesn't exist yet, create it
        const { error: createError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: newUserId,
            balance: REFERRAL_TOKEN_REWARD,
            invited_by: referrerId,
            mining_rate: 0.003
          })
          
        if (createError) {
          throw createError
        }
        
        console.log(`Created new profile for user ${newUserId} with referral bonus`);
      } else {
        // Update existing profile
        const { error: updateNewUserError } = await supabaseAdmin
          .from('profiles')
          .update({
            balance: (newUserData.balance || 0) + REFERRAL_TOKEN_REWARD,
            invited_by: referrerId
          })
          .eq('id', newUserId)
          
        if (updateNewUserError) {
          throw updateNewUserError
        }
        
        console.log(`Updated invitee (${newUserId}) with token reward: ${REFERRAL_TOKEN_REWARD}`);
      }
      
      // 3. Create audit entry
      const { error: auditError } = await supabaseAdmin
        .from('referral_audit')
        .insert({
          referrer_id: referrerId,
          invitee_id: newUserId,
          code: normalizedCode
        })
        
      if (auditError) {
        console.error('Error creating audit log:', auditError)
        // Non-critical error, continue
      }
      
      // 4. Enable realtime updates for this user and the referrer
      try {
        await supabaseAdmin.functions.invoke('enable_realtime', {
          body: { table: 'profiles' }
        }).catch(err => {
          console.warn("Error enabling realtime:", err);
        });
      } catch (error) {
        console.warn("Error enabling realtime:", error);
      }
      
      console.log('Referral rewards applied successfully')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          result: {
            referrer: {
              id: referrerId,
              miningRateBonus: REFERRAL_BONUS_RATE,
              newMiningRate: newMiningRate
            },
            invitee: {
              id: newUserId,
              tokenReward: REFERRAL_TOKEN_REWARD
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      console.error('Error processing rewards:', error)
      throw new Error(`Transaction failed: ${error.message}`)
    }
  } catch (error) {
    console.error('Error in process_referral_code function:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
})
