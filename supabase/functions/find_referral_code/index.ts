
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
    const body = await req.json();
    const { code } = body;
    
    if (!code) {
      throw new Error('Referral code is required')
    }

    console.log(`Processing referral code: ${code}`);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    // Normalize code to uppercase and trim
    const normalizedCode = code.trim().toUpperCase()
    console.log(`Normalized code: ${normalizedCode}`);

    // First check in profiles table for persistent codes
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('referral_code', normalizedCode)
      .limit(1)
      .single()
      
    if (profileData) {
      console.log(`Referral code found in profiles: ${JSON.stringify(profileData)}`);
      
      return new Response(
        JSON.stringify({
          exists: true,
          owner: profileData.id,
          used: false // Persistent codes are always valid
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }
    
    // If not found in profiles, check in referral_codes table (legacy)
    const { data: codeData, error: codeError } = await supabaseClient
      .from('referral_codes')
      .select('id, owner, used, used_by')
      .eq('code', normalizedCode)
      .limit(1)
      .single()

    if (codeError) {
      // If not found in either table, return not exists
      if (codeError.code === 'PGRST116' || profileError?.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ exists: false, message: 'Code not found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }
      
      throw codeError
    }

    console.log(`Referral code found in legacy table: ${JSON.stringify(codeData)}`);
    
    return new Response(
      JSON.stringify({
        exists: true,
        owner: codeData.owner,
        used: codeData.used,
        used_by: codeData.used_by
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in find_referral_code function:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
