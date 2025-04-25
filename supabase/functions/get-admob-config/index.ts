
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the AdMob configuration from environment variables
    const appId = Deno.env.get('ADMOB_APP_ID');
    const rewardAdUnitId = Deno.env.get('ADMOB_REWARD_AD_UNIT_ID');
    
    // Log for debugging
    console.log('AdMob config values:', { appId, rewardAdUnitId });
    
    if (!appId || !rewardAdUnitId) {
      throw new Error('AdMob configuration is missing');
    }

    // Send the configuration wrapped in a data field to match the expected format
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
