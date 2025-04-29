
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
    // Always use test mode
    const isTestMode = true;

    const config = {
      // Test App ID - Android
      appId: "ca-app-pub-3940256099942544~3347511713",
      isTestMode: isTestMode,
      
      // Android Test Ad Unit IDs
      rewardAdUnitId: "ca-app-pub-3940256099942544/5224354917",
      bannerAdUnitId: "ca-app-pub-3940256099942544/6300978111",
      interstitialAdUnitId: "ca-app-pub-3940256099942544/1033173712",
      
      // iOS Test App ID ve Ad Unit IDs
      iOSAppId: "ca-app-pub-3940256099942544~1458002511",
      iOSRewardAdUnitId: "ca-app-pub-3940256099942544/1712485313",
      iOSBannerAdUnitId: "ca-app-pub-3940256099942544/2934735716",
      iOSInterstitialAdUnitId: "ca-app-pub-3940256099942544/4411468910",
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
    console.error("Error in get-admob-config:", error.message);
    
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
