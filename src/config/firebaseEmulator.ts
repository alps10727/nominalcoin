
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
 * Emülatörlerin kullanımda olup olmadığını kontrol eder
 */
export function isEmulatorEnabled(): boolean {
  // Geliştirme ortamında otomatik olarak etkinleştir
  // veya manuel olarak kontrol et - localStorage kullanabilirsiniz
  return process.env.NODE_ENV === 'development' && 
         localStorage.getItem('useFirebaseEmulator') === 'true';
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
