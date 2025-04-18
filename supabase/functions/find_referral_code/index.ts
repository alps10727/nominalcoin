
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

    // Query referral codes table
    const { data, error } = await supabaseClient
      .from('referral_codes')
      .select('id, owner, used, used_by')
      .eq('code', normalizedCode)
      .limit(1)
      .single()

    if (error) {
      console.error('Error querying referral code:', error.message)
      
      // If not found, return specific message
      if (error.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ exists: false, message: 'Code not found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200 
          }
        )
      }
      
      throw error
    }

    console.log(`Referral code found: ${JSON.stringify(data)}`);
    
    return new Response(
      JSON.stringify({
        exists: true,
        owner: data.owner,
        used: data.used,
        used_by: data.used_by
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
