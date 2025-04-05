
/**
 * Benzersiz referans kodu oluşturur
 * Format: XXX-XXX-XXX (X: alfanumerik karakterler)
 */
export function generateReferralCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // 3-3-3 formatında bir referans kodu oluştur
  const firstPart = generateRandomString(characters, 3);
  const secondPart = generateRandomString(characters, 3);
  const thirdPart = generateRandomString(characters, 3);
  
  return `${firstPart}-${secondPart}-${thirdPart}`;
}

/**
 * Belirli uzunlukta rastgele karakter dizisi üretir
 */
function generateRandomString(characters: string, length: number): string {
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

/**
 * Verilen referans kodunun doğru formatta olup olmadığını kontrol eder
 */
export function validateReferralCode(code: string): boolean {
  if (!code) return false;
  
  // XXX-XXX-XXX formatını kontrol et (X: alfanümerik karakter)
  const pattern = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/;
  return pattern.test(code);
}

/**
 * Referans bağlantısı oluşturur
 */
export function createReferralLink(referralCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/sign-up?ref=${referralCode}`;
}
