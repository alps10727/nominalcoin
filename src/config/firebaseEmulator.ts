
// Firebase emülatör yapılandırması
// Bu dosya yalnızca geliştirme ortamında kullanılır

/**
 * Firebase emülatör host adresleri ve portları
 */
export const emulatorConfig = {
  // Varsayılan "localhost" ayarları
  auth: { host: "localhost", port: 9099 },
  firestore: { host: "localhost", port: 8080 },
  storage: { host: "localhost", port: 9199 },
  functions: { host: "localhost", port: 5001 },
};

/**
 * Rate limiting için yapılandırma
 */
export const securityConfig = {
  rateLimit: {
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000
  }
};

/**
 * Emülatörlerin kullanımda olup olmadığını kontrol eder
 * Varsayılan olarak devre dışı bırakıyoruz
 */
export function isEmulatorEnabled(): boolean {
  // Üretim ortamında her zaman false döndür
  if (import.meta.env.PROD) {
    return false;
  }
  
  const storedValue = localStorage.getItem('useFirebaseEmulator');
  return storedValue === 'true';
}

/**
 * Rate limiti kontrol eder
 */
export function checkRateLimit(requestType: string): boolean {
  const now = Date.now();
  const requestKey = `rateLimit_${requestType}`;
  const minuteKey = `${requestKey}_minute`;
  const hourKey = `${requestKey}_hour`;
  
  // Dakika bazında kontrol
  const minuteData = localStorage.getItem(minuteKey);
  let minuteCount = 0;
  let minuteTime = now;
  
  if (minuteData) {
    const data = JSON.parse(minuteData);
    minuteCount = data.count;
    minuteTime = data.time;
    
    // 1 dakika geçtiyse sıfırla
    if (now - minuteTime > 60000) {
      minuteCount = 0;
      minuteTime = now;
    } else if (minuteCount >= securityConfig.rateLimit.maxRequestsPerMinute) {
      console.error(`Rate limit exceeded for ${requestType} (minute)`);
      return false;
    }
  }
  
  // Saat bazında kontrol
  const hourData = localStorage.getItem(hourKey);
  let hourCount = 0;
  let hourTime = now;
  
  if (hourData) {
    const data = JSON.parse(hourData);
    hourCount = data.count;
    hourTime = data.time;
    
    // 1 saat geçtiyse sıfırla
    if (now - hourTime > 3600000) {
      hourCount = 0;
      hourTime = now;
    } else if (hourCount >= securityConfig.rateLimit.maxRequestsPerHour) {
      console.error(`Rate limit exceeded for ${requestType} (hour)`);
      return false;
    }
  }
  
  // Sayaçları güncelle
  localStorage.setItem(minuteKey, JSON.stringify({ count: minuteCount + 1, time: minuteTime }));
  localStorage.setItem(hourKey, JSON.stringify({ count: hourCount + 1, time: hourTime }));
  
  return true;
}

/**
 * Emülatör kullanımını etkinleştirir veya devre dışı bırakır
 */
export function setEmulatorEnabled(enabled: boolean): void {
  localStorage.setItem('useFirebaseEmulator', enabled ? 'true' : 'false');
  
  // Değişikliklerin etkili olması için sayfayı yeniden yükle
  if (window.location.hostname === 'localhost') {
    window.location.reload();
  }
}

/**
 * Emülatör UI URL'sini döndürür
 */
export function getEmulatorUiUrl(): string {
  return `http://${emulatorConfig.firestore.host}:4000`;
}
