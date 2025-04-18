
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    // Normalize code to uppercase
    const normalizedCode = code.toUpperCase()

    // Start a Postgres transaction using RPC
    const { data: result, error: transactionError } = await supabaseClient.rpc(
      'process_referral_transaction', 
      {
        p_code: normalizedCode,
        p_new_user_id: newUserId
      }
    )

    if (transactionError) {
      console.error('Transaction error:', transactionError)
      throw new Error(`Transaction failed: ${transactionError.message}`)
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in process_referral_code function:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
