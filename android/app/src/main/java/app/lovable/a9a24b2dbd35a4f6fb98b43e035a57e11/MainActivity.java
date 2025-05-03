
package app.lovable.a9a24b2dbd35a4f6fb98b43e035a57e11;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {
  private static final String TAG = "NominalCoin";

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    Log.d(TAG, "MainActivity onCreate başlatıldı");
    
    // Google AdMob SDK'yı başlat
    try {
      MobileAds.initialize(this, initializationStatus -> {
        // SDK başlatıldı, isteğe bağlı callback işlemleri burada yapılabilir
        Log.d(TAG, "AdMob başarıyla başlatıldı: " + initializationStatus.toString());
      });
      Log.d(TAG, "AdMob initialize çağrıldı");
    } catch (Exception e) {
      Log.e(TAG, "AdMob başlatılırken hata: " + e.getMessage(), e);
    }
  }
}
