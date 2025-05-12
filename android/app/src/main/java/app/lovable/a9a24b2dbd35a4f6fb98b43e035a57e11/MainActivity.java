
package app.lovable.a9a24b2dbd35a4f6fb98b43e035a57e11;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import android.util.Log;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {
  private static final String TAG = "MainActivity";
  
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
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
  }
  
  @Override
  public void onPause() {
    super.onPause();
  }
  
  @Override
  public void onDestroy() {
    super.onDestroy();
  }
}
