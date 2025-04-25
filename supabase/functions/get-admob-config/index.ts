
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
    // Use test ad unit IDs for development
    const isTestMode = true;
    
    const config = {
      appId: isTestMode 
        ? 'ca-app-pub-3940256099942544~3347511713' // Test App ID
        : Deno.env.get('ADMOB_APP_ID'),
      
      rewardAdUnitId: isTestMode
        ? 'ca-app-pub-3940256099942544/5224354917' // Test Reward Ad Unit ID
        : Deno.env.get('ADMOB_REWARD_AD_UNIT_ID'),
    }

    return new Response(
      JSON.stringify({ data: config }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
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
