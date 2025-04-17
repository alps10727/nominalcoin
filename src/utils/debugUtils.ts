
/**
 * Hata ayıklama için geliştirilmiş loglama yardımcı programı
 */
export const debugLog = (context: string, message: string, data?: any) => {
  console.log(`[${context}] ${message}`, data !== undefined ? data : '');
};

/**
 * Ek bağlamla bir hata günlüğe kaydet
 */
export const errorLog = (context: string, message: string, error?: any) => {
  console.error(`[${context}] HATA: ${message}`, error !== undefined ? error : '');
  
  // Hata stack'ini analiz et ve daha anlamlı mesajlar sun
  if (error instanceof Error) {
    if (error.message.includes('timeout') || error.message.includes('zaman aşımı')) {
      console.error(`[${context}] Sunucu yanıt vermiyor veya ağ bağlantısı yavaş. Timeout süresi artırılabilir.`);
    } else if (error.message.includes('offline') || error.message.includes('unavailable')) {
      console.error(`[${context}] İnternet bağlantısı yok veya sunucu kullanılamıyor. Çevrimdışı mod etkinleştirildi.`);
    } else if (error.message.includes('permission-denied')) {
      console.error(`[${context}] Firebase erişim izni hatası. Güvenlik kurallarını kontrol edin.`);
    }
  }
};

/**
 * Performansı ölçmek için basit zamanlayıcı yardımcı programı
 */
export class Timer {
  private startTime: number;
  private name: string;
  private marks: {name: string, time: number}[] = [];

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
    debugLog("Timer", `${name} zamanlayıcısı başlatıldı`);
  }
  
  /**
   * Bir ara zaman işareti ekler
   */
  mark(markName: string) {
    const markTime = performance.now();
    const timeSinceStart = markTime - this.startTime;
    this.marks.push({name: markName, time: markTime});
    debugLog("Timer", `${this.name}: ${markName} - ${timeSinceStart.toFixed(2)}ms (başlangıçtan itibaren)`);
    return timeSinceStart;
  }

  /**
   * Zamanlayıcıyı durdurur ve toplam süreyi döndürür
   */
  stop() {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    
    // Detaylı zaman ölçümü raporu oluştur
    debugLog("Timer", `${this.name} ${duration.toFixed(2)}ms içinde tamamlandı`);
    
    if (this.marks.length > 0) {
      let lastTime = this.startTime;
      
      this.marks.forEach((mark) => {
        const segmentDuration = mark.time - lastTime;
        debugLog("Timer", `  - ${mark.name}: ${segmentDuration.toFixed(2)}ms`);
        lastTime = mark.time;
      });
      
      const finalSegment = endTime - lastTime;
      if (finalSegment > 5) {
        debugLog("Timer", `  - Son segment: ${finalSegment.toFixed(2)}ms`);
      }
    }
    
    return duration;
  }
}

/**
 * Ağ durumunu izler ve değişiklikleri raporlar
 */
export const networkMonitor = {
  start: () => {
    const handleOnline = () => debugLog("Network", "İnternet bağlantısı kuruldu");
    const handleOffline = () => errorLog("Network", "İnternet bağlantısı kesildi");
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Mevcut ağ durumunu raporla
    debugLog("Network", `Mevcut ağ durumu: ${navigator.onLine ? 'Çevrimiçi' : 'Çevrimdışı'}`);
    if (!navigator.onLine) {
      errorLog("Network", "Uygulama başlatılırken internet bağlantısı yok. Çevrimdışı modda çalışılıyor.");
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
};

/**
 * Uygulama başlatıcı yardımcı fonksiyon
 */
export const appStartupLogger = () => {
  debugLog("App", "Uygulama başlatılıyor...");
  debugLog("App", `Tarayıcı: ${navigator.userAgent}`);
  debugLog("App", `Çevrimiçi durumu: ${navigator.onLine}`);
  debugLog("App", `Dil: ${navigator.language}`);
  
  return new Timer("AppStartup");
};

/**
 * Firebase bağlantı durumunu kontrol eden fonksiyon
 */
export const checkFirebaseConnection = () => {
  const connectionTimer = new Timer("FirebaseConnection");
  return {
    start: connectionTimer,
    success: () => {
      connectionTimer.mark("Firebase bağlantısı başarılı");
      debugLog("Firebase", "Firebase servisleri başarıyla başlatıldı");
    },
    error: (err: any) => {
      connectionTimer.mark("Firebase bağlantısı başarısız");
      errorLog("Firebase", "Firebase servisleri başlatılırken hata oluştu", err);
    }
  };
};
