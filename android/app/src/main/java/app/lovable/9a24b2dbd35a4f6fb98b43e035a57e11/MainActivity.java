
package app.lovable.9a24b2dbd35a4f6fb98b43e035a57e11;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    
    // Google AdMob SDK'yı başlat
    MobileAds.initialize(this, initializationStatus -> {
      // SDK başlatıldı, isteğe bağlı callback işlemleri burada yapılabilir
    });
  }
}
