
package app.lovable.a9a24b2dbd35a4f6fb98b43e035a57e11;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {
  private static final String TAG = "MainActivity";
  private AdView mAdView;
  
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Google AdMob SDK'yı başlat
    MobileAds.initialize(this, initializationStatus -> {
      Log.d(TAG, "AdMob SDK başarıyla başlatıldı");
      // SDK başlatıldıktan sonra banner reklamı yükle
      loadBanner();
    });
    
    Log.d(TAG, "MainActivity onCreate çağrıldı");
  }
  
  @Override
  public void onStart() {
    super.onStart();
    Log.d(TAG, "MainActivity onStart çağrıldı");
  }
  
  @Override
  public void onResume() {
    super.onResume();
    Log.d(TAG, "MainActivity onResume çağrıldı");
    if (mAdView != null) {
      mAdView.resume();
    }
  }
  
  @Override
  public void onPause() {
    super.onPause();
    if (mAdView != null) {
      mAdView.pause();
    }
  }
  
  @Override
  public void onDestroy() {
    super.onDestroy();
    if (mAdView != null) {
      mAdView.destroy();
    }
  }
  
  private void loadBanner() {
    try {
      // Layout içindeki AdView'e erişim sağlayalım
      mAdView = findViewById(getResources().getIdentifier("adView", "id", getPackageName()));
      
      if (mAdView == null) {
        Log.e(TAG, "AdView bulunamadı, programatik olarak oluşturuluyor");
        
        // Programatik olarak AdView oluşturalım
        mAdView = new AdView(this);
        mAdView.setAdUnitId("ca-app-pub-3940256099942544/6300978111"); // Test ID
        mAdView.setAdSize(com.google.android.gms.ads.AdSize.BANNER);
        
        // AdView için Layout parametreleri oluştur
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT);
        params.addRule(RelativeLayout.ALIGN_PARENT_BOTTOM);
        
        // Bridge view'e erişim sağla
        ViewGroup rootView = (ViewGroup) getBridge().getWebView().getParent();
        rootView.addView(mAdView, params);
      }
      
      // Reklam isteği oluştur
      AdRequest adRequest = new AdRequest.Builder().build();
      
      // Reklamı yükle
      mAdView.loadAd(adRequest);
      Log.d(TAG, "Banner reklam yükleme isteği başlatıldı");
    } catch (Exception e) {
      Log.e(TAG, "Banner reklam yüklenirken hata oluştu: " + e.getMessage(), e);
    }
  }
}
