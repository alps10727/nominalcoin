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
    const isTestMode = false; // Change to false since we're using a real app ID
    
    const config = {
      // Android App ID
      appId: "ca-app-pub-2373579046576398~2384328016",
      
      // Android Ad Unit IDs (please replace with your actual ad unit IDs)
      rewardAdUnitId: isTestMode
        ? 'ca-app-pub-3940256099942544/5224354917'
        : Deno.env.get('ADMOB_REWARD_AD_UNIT_ID'),
        
      bannerAdUnitId: isTestMode 
        ? 'ca-app-pub-3940256099942544/6300978111' // Test Banner Ad Unit ID (Android)
        : Deno.env.get('ADMOB_BANNER_AD_UNIT_ID'),
        
      interstitialAdUnitId: isTestMode
        ? 'ca-app-pub-3940256099942544/1033173712' // Test Interstitial Ad Unit ID (Android)
        : Deno.env.get('ADMOB_INTERSTITIAL_AD_UNIT_ID'),
      
      // iOS App ID and Ad Unit IDs  
      iOSAppId: isTestMode
        ? 'ca-app-pub-3940256099942544~1458002511' // Test iOS App ID
        : Deno.env.get('ADMOB_IOS_APP_ID'),
        
      iOSRewardAdUnitId: isTestMode
        ? 'ca-app-pub-3940256099942544/1712485313' // Test iOS Reward Ad Unit ID
        : Deno.env.get('ADMOB_IOS_REWARD_AD_UNIT_ID'),
        
      iOSBannerAdUnitId: isTestMode
        ? 'ca-app-pub-3940256099942544/2934735716' // Test iOS Banner Ad Unit ID
        : Deno.env.get('ADMOB_IOS_BANNER_AD_UNIT_ID'),
        
      iOSInterstitialAdUnitId: isTestMode
        ? 'ca-app-pub-3940256099942544/4411468910' // Test iOS Interstitial Ad Unit ID
        : Deno.env.get('ADMOB_IOS_INTERSTITIAL_AD_UNIT_ID'),
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
