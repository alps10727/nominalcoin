
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
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }
    
    const { code } = body;
    
    if (!code) {
      console.log("Missing referral code in request");
      return new Response(
        JSON.stringify({ error: 'Referral code is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    console.log(`Processing referral code request: ${code}`);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    // Normalize code to uppercase and trim
    const normalizedCode = code.trim().toUpperCase();
    console.log(`Normalized code: ${normalizedCode}`);

    // First check in profiles table for persistent codes
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, referral_code')
      .eq('referral_code', normalizedCode)
      .limit(1)
      .maybeSingle();
      
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
    
    // More detailed logging for troubleshooting
    if (profileError && profileError.code !== 'PGRST116') {
      console.error(`Error querying profiles: ${JSON.stringify(profileError)}`);
    } else {
      console.log(`No profile found with referral code: ${normalizedCode}`);
    }
    
    // If not found in profiles, check in referral_codes table (legacy)
    const { data: codeData, error: codeError } = await supabaseClient
      .from('referral_codes')
      .select('id, owner, used, used_by, code')
      .eq('code', normalizedCode)
      .limit(1)
      .maybeSingle();

    if (codeData) {
      console.log(`Referral code found in legacy table: ${JSON.stringify(codeData)}`);
      
      return new Response(
        JSON.stringify({
          exists: true,
          owner: codeData.owner,
          used: codeData.used,
          used_by: codeData.used_by,
          code: codeData.code
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }
    
    if (codeError && codeError.code !== 'PGRST116') {
      console.error(`Error querying referral_codes: ${JSON.stringify(codeError)}`);
    } else {
      console.log(`No referral code found in legacy table for: ${normalizedCode}`);
    }

    // If we get here, code was not found in either location
    console.log(`Referral code not found in any table: ${normalizedCode}`);
    return new Response(
      JSON.stringify({ exists: false, message: 'Code not found' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in find_referral_code function:', error.message, error.stack)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
