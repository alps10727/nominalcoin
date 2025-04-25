
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9a24b2dbd35a4f6fb98b43e035a57e11',
  appName: 'Nominal Coin',
  webDir: 'dist',
  server: {
    url: 'https://9a24b2db-d35a-4f6f-b98b-43e035a57e11.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false,
  // Mobil görünüm için ek yapılandırmalar
  ios: {
    contentInset: 'always',
    scheme: 'nominalcoin',
    limitsNavigationsToAppBoundDomains: true,
    // iOS splash screen'in ortalanması için ek yapılandırma
    backgroundColor: "#073042",
    preferredContentMode: "mobile",
    splashScreenDelay: 3000, // Splash ekranının gösterilme süresi (ms)
    // iOS izinleri için Info.plist eklemeleri
    infoPlist: {
      NSCameraUsageDescription: "QR kodları taramak ve profil resmi çekmek için kamera erişimi gereklidir.",
      NSPhotoLibraryUsageDescription: "Profil resmi seçmek için fotoğraf kütüphanesi erişimi gereklidir.",
      NSLocationWhenInUseUsageDescription: "Size yakın etkinlikleri ve fırsatları göstermek için konum erişimi gereklidir.",
      NSFaceIDUsageDescription: "Güvenli giriş için FaceID kullanımına izin verin.",
      CFBundleLocalizations: ["tr", "en"],
      CFBundleDevelopmentRegion: "tr",
      // GDPR ve COPPA uyumlu kullanım için eklenir
      NSUserTrackingUsageDescription: "Bu izin, size kişiselleştirilmiş reklamlar sunmak için kullanılacaktır.",
      // AdMob için gerekli ek bilgiler
      GADApplicationIdentifier: "ca-app-pub-3940256099942544~1458002511", // Test App ID (iOS)
      SKAdNetworkItems: [
        {
          SKAdNetworkIdentifier: "cstr6suwn9.skadnetwork"
        },
        {
          SKAdNetworkIdentifier: "4pfyvq9l8r.skadnetwork"
        },
        {
          SKAdNetworkIdentifier: "2fnua5tdw4.skadnetwork"
        }
      ]
    }
  },
  android: {
    captureInput: true,
    webViewUserAgentTemplate: 'NominalCoin Android App',
    // Android izinleri için AndroidManifest eklemeleri
    androidXEnabled: true,
    backgroundColor: "#073042",
    allowMixedContent: true,
    // Android için otomatik izin talepleri
    permissions: [
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.INTERNET"
    ],
    // AdMob için gerekli meta-data'lar
    appendUserAgent: "NominalCoin",
    // AndroidManifest.xml'e eklenecek meta-data'lar
    includePlugins: ["@capacitor/admob"],
    buildOptions: {
      keystorePath: "nominalcoin.keystore",
      keystoreAlias: "nominalalias",
    }
  },
  // Capacitor plugin'leri için yapılandırmalar
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#073042",
      spinnerStyle: "large",
      spinnerColor: "#ffffff",
      iosSpinnerStyle: "large",
      androidSpinnerStyle: "large",
      showSpinner: true,
      layoutName: "launch_screen",
      useDialog: false
    },
    LocalNotifications: {
      smallIcon: "ic_stat_notification",
      iconColor: "#488AFF"
    },
    // AdMob konfigürasyonu
    Admob: {
      android: {
        initialize: true,
      },
      ios: {
        initialize: true,
      },
    },
    // Belirtik AdMob plugin yapılandırması
    AdMob: {
      // Initialize automatically
      initialize: true,
      // Test mode for development
      testingDevices: ["DEVICE_ID_HERE"],
      initializeForTesting: true
    }
  }
};

export default config;
