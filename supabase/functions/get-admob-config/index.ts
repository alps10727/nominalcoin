
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
    const isTestMode = true; // Set to true to use test ads

    const config = {
      // Android App ID
      appId: "ca-app-pub-2373579046576398~2384328016",
      
      // Android Ad Unit IDs
      rewardAdUnitId: isTestMode ? 'ca-app-pub-3940256099942544/5224354917' : 'ca-app-pub-2373579046576398/7924796812',
      bannerAdUnitId: isTestMode ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-2373579046576398/3298628159', 
      interstitialAdUnitId: isTestMode ? 'ca-app-pub-3940256099942544/1033173712' : 'ca-app-pub-2373579046576398/1765155572',
      
      // iOS App ID and Ad Unit IDs
      iOSAppId: 'ca-app-pub-3940256099942544~1458002511',
      iOSRewardAdUnitId: isTestMode ? 'ca-app-pub-3940256099942544/1712485313' : 'ca-app-pub-2373579046576398/7924796812',
      iOSBannerAdUnitId: isTestMode ? 'ca-app-pub-3940256099942544/2934735716' : 'ca-app-pub-2373579046576398/3298628159',
      iOSInterstitialAdUnitId: isTestMode ? 'ca-app-pub-3940256099942544/4411468910' : 'ca-app-pub-2373579046576398/1765155572',
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
