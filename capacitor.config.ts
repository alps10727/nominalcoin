
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9a24b2dbd35a4f6fb98b43e035a57e11',
  appName: 'Future Coin',
  webDir: 'dist',
  server: {
    url: 'https://9a24b2db-d35a-4f6f-b98b-43e035a57e11.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false,
  // Mobil görünüm için ek yapılandırmalar
  ios: {
    contentInset: 'always',
    scheme: 'futurecoin',
    limitsNavigationsToAppBoundDomains: true
  },
  android: {
    captureInput: true,
    webViewUserAgentTemplate: 'FutureCoin Android App'
  }
};

export default config;
