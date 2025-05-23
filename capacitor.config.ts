
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a9a24b2dbd35a4f6fb98b43e035a57e11',
  appName: 'Nominal Coin',
  webDir: 'dist',
  server: {
    url: 'https://9a24b2db-d35a-4f6f-b98b-43e035a57e11.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false,
  ios: {
    contentInset: 'always',
    scheme: 'nominalcoin',
    limitsNavigationsToAppBoundDomains: true,
    backgroundColor: "#073042",
    preferredContentMode: "mobile",
    splashScreenDelay: 3000,
    infoPlist: {
      NSCameraUsageDescription: "QR kodları taramak ve profil resmi çekmek için kamera erişimi gereklidir.",
      NSPhotoLibraryUsageDescription: "Profil resmi seçmek için fotoğraf kütüphanesi erişimi gereklidir.",
      NSLocationWhenInUseUsageDescription: "Size yakın etkinlikleri ve fırsatları göstermek için konum erişimi gereklidir.",
      NSFaceIDUsageDescription: "Güvenli giriş için FaceID kullanımına izin verin.",
      CFBundleLocalizations: ["tr", "en"],
      CFBundleDevelopmentRegion: "tr"
    }
  },
  android: {
    captureInput: true,
    webViewUserAgentTemplate: 'NominalCoin Android App',
    backgroundColor: "#073042",
    allowMixedContent: true,
    permissions: [
      "android.permission.CAMERA",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.INTERNET"
    ],
    appendUserAgent: "NominalCoin",
    includePlugins: ["@capacitor/app"],
    buildOptions: {
      keystorePath: "nominalcoin.keystore",
      keystoreAlias: "nominalalias",
    }
  },
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
    AdMob: {
      applicationID: "ca-app-pub-2373579046576398~2384328016",
      requestTrackingAuthorization: true
    }
  }
};

export default config;
