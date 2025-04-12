
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  enableMultiTabIndexedDbPersistence,
  connectFirestoreEmulator,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  connectAuthEmulator,
  initializeAuth,
  indexedDBLocalPersistence
} from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { emulatorConfig, isEmulatorEnabled } from "./firebaseEmulator";
import { debugLog, errorLog } from "@/utils/debugUtils";

// Firebase configuration strictly from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Gelişmiş Firestore konfigürasyonu - yüksek ölçeklenebilirlik için
export const db = initializeFirestore(app, {
  // Gelişmiş önbellek yapılandırması - yüksek performans için
  localCache: persistentLocalCache({
    // Sekme yönetimi - tüm sekmelerde veri senkronizasyonu
    tabManager: persistentMultipleTabManager(),
    // Sınırsız önbellek boyutu (dikkatli kullanın)
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

// İleri düzey auth yapılandırması - güvenilir oturum yönetimi
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence]
});

export const analytics = getAnalytics(app);
export const storage = getStorage(app);

// Uygulama başlatıldı metriği
logEvent(analytics, 'app_initialized', {
  timestamp: Date.now(),
  environment: import.meta.env.MODE
});

// Auth durumunu önbelleğe alma
setPersistence(auth, browserLocalPersistence).catch(err => {
  errorLog("firebase", "Auth persistence error:", err);
});

// Rate limiting için gelişmiş yapılandırma
// Yüksek trafikli ortamlar için özelleştirilmiş
class RateLimiter {
  private requestCounts: Map<string, { count: number, resetTime: number }> = new Map();
  private readonly MINUTE_MS = 60 * 1000;
  private readonly HOUR_MS = 60 * 60 * 1000;
  
  constructor(
    private maxRequestsPerMinute: number = 100,
    private maxRequestsPerHour: number = 2000,
    private maxConcurrentRequests: number = 20
  ) {}
  
  public checkLimit(operationType: string): boolean {
    const now = Date.now();
    const minuteKey = `${operationType}_minute`;
    const hourKey = `${operationType}_hour`;
    
    // Dakika bazında limit kontrolü
    let minuteData = this.requestCounts.get(minuteKey) || { count: 0, resetTime: now + this.MINUTE_MS };
    if (now > minuteData.resetTime) {
      minuteData = { count: 0, resetTime: now + this.MINUTE_MS };
    }
    
    if (minuteData.count >= this.maxRequestsPerMinute) {
      debugLog("RateLimiter", `Rate limit exceeded for ${operationType} (minute)`);
      return false;
    }
    
    // Saat bazında limit kontrolü
    let hourData = this.requestCounts.get(hourKey) || { count: 0, resetTime: now + this.HOUR_MS };
    if (now > hourData.resetTime) {
      hourData = { count: 0, resetTime: now + this.HOUR_MS };
    }
    
    if (hourData.count >= this.maxRequestsPerHour) {
      debugLog("RateLimiter", `Rate limit exceeded for ${operationType} (hour)`);
      return false;
    }
    
    // Sayaçları güncelle
    minuteData.count++;
    hourData.count++;
    
    this.requestCounts.set(minuteKey, minuteData);
    this.requestCounts.set(hourKey, hourData);
    
    return true;
  }
  
  public resetLimits(): void {
    this.requestCounts.clear();
  }
}

// Küresel rate limiter - tüm Firebase isteklerini korur
export const globalRateLimiter = new RateLimiter();

// Emülatör kullanımını kontrol et ve bağlan
if (isEmulatorEnabled()) {
  debugLog("firebase", "🔥 Firebase Emülatörleri kullanılıyor!");
  
  try {
    // Rate limiter kontrolü
    if (globalRateLimiter.checkLimit("emulator_connect")) {
      connectAuthEmulator(auth, `http://${emulatorConfig.auth.host}:${emulatorConfig.auth.port}`);
      connectFirestoreEmulator(db, emulatorConfig.firestore.host, emulatorConfig.firestore.port);
      connectStorageEmulator(storage, emulatorConfig.storage.host, emulatorConfig.storage.port);
    }
  } catch (err) {
    errorLog("firebase", "Emulator connection error:", err);
  }
} else {
  try {
    // Offline önbelleği etkinleştir - yüksek performans için
    enableMultiTabIndexedDbPersistence(db)
      .then(() => {
        debugLog("firebase", "Firestore offline persistence etkinleştirildi");
      })
      .catch((err) => {
        if (err.code !== 'failed-precondition') {
          errorLog("firebase", "Offline persistence hatası:", err);
        } else {
          debugLog("firebase", "Birden fazla sekme açık - tam persistence sınırlı olabilir");
        }
      });
  } catch (error) {
    errorLog("firebase", "Persistence hatası:", error);
  }
}

// Firebase performans izleyicisi
export const recordFirebaseOperation = (operation: string, durationMs: number) => {
  // Yalnızca uzun süren işlemleri kaydet (> 500ms)
  if (durationMs > 500) {
    logEvent(analytics, 'slow_operation', {
      operation_type: operation,
      duration_ms: durationMs
    });
  }
};
