
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

    // Generate possible code variations to handle common misreadings
    const possibleCodes = generateCodeVariations(normalizedCode);
    console.log(`Testing ${possibleCodes.length} possible code variations`);

    // First check in profiles table for persistent codes
    for (const testCode of possibleCodes) {
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('id, referral_code')
        .eq('referral_code', testCode)
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
      
      // Only log meaningful errors, not "not found"
      if (profileError && profileError.code !== 'PGRST116') {
        console.error(`Error querying profiles: ${JSON.stringify(profileError)}`);
      } 
    }
    
    console.log(`No profile found with referral code: ${normalizedCode}`);
    
    // If not found in profiles, check in referral_codes table (legacy)
    for (const testCode of possibleCodes) {
      const { data: codeData, error: codeError } = await supabaseClient
        .from('referral_codes')
        .select('id, owner, used, used_by, code')
        .eq('code', testCode)
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
      }
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

// Helper function to generate code variations for common misreadings
function generateCodeVariations(code: string): string[] {
  if (!code || code.length !== 6) return [code];
  
  const variations: string[] = [code];
  
  // Map of visually similar characters
  const similarChars: Record<string, string[]> = {
    'O': ['0'],
    '0': ['O'],
    'I': ['1', 'L'],
    '1': ['I', 'L'],
    'L': ['1', 'I'],
    'B': ['8'],
    '8': ['B'],
    '5': ['S'],
    'S': ['5'],
    'Z': ['2'],
    '2': ['Z'],
  };
  
  // Generate variations
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const similars = similarChars[char];
    
    if (similars) {
      for (const similar of similars) {
        variations.push(
          code.substring(0, i) + similar + code.substring(i + 1)
        );
      }
    }
  }
  
  return [...new Set(variations)]; // Remove duplicates
}
