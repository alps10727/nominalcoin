
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
 * Varsayılan olarak devre dışı bırakıyoruz
 */
export function isEmulatorEnabled(): boolean {
  // Varsayılan olarak false döndür (gerçek Firebase kullan)
  return false;
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
