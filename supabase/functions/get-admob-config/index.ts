
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests properly
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the AdMob configuration from environment variables
    const appId = Deno.env.get('ADMOB_APP_ID');
    const rewardAdUnitId = Deno.env.get('ADMOB_REWARD_AD_UNIT_ID');
    
    // Enhanced logging for debugging
    console.log('AdMob config request received');
    console.log('Environment variables loaded:', { 
      appId: appId ? 'Present' : 'Missing', 
      rewardAdUnitId: rewardAdUnitId ? 'Present' : 'Missing' 
    });
    
    if (!appId || !rewardAdUnitId) {
      throw new Error('AdMob configuration is missing from environment variables');
    }

    // Ensure we're sending the correct response format with proper data structure
    return new Response(
      JSON.stringify({ 
        data: {
          appId, 
          rewardAdUnitId 
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200
      },
    )
  } catch (error) {
    console.error('Error in get-admob-config:', error.message);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to retrieve AdMob configuration'
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
