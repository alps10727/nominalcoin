
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // OPTIONS isteği için CORS yanıtı
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Daima test modu kullanılıyor
    const isTestMode = true;

    // Platform kontrolü için platform bilgisini almaya çalış
    let platform = 'android'; // Varsayılan platform
    try {
      const url = new URL(req.url);
      platform = url.searchParams.get('platform') || 'android';
    } catch (e) {
      console.error("URL parsing error:", e);
    }

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
      
      // Talep edilen platform bilgisi
      requestedPlatform: platform
    }

    // Başarılı yanıt
    return new Response(
      JSON.stringify({ 
        data: config,
        success: true,
        timestamp: new Date().toISOString() 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    )
  } catch (error) {
    console.error("Error in get-admob-config:", error.message);
    
    // Hata yanıtı
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        timestamp: new Date().toISOString() 
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
