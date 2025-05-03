
package app.lovable.a9a24b2dbd35a4f6fb98b43e035a57e11;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;
import android.util.Log;

public class MainActivity extends BridgeActivity {
  private static final String TAG = "MainActivity";
  
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Google AdMob SDK'yı başlat
    MobileAds.initialize(this, initializationStatus -> {
      // SDK başlatıldı, hata ayıklama için log ekleyelim
      Log.d(TAG, "AdMob SDK başarıyla başlatıldı");
    });
    
    Log.d(TAG, "MainActivity onCreate çağrıldı");
  }
}
