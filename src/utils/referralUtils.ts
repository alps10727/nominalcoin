
/**
 * Benzersiz referans kodu oluşturur
 * Format: XXX-XXX-XXX (X: alfanumerik karakterler)
 * Her kullanıcı için benzersiz olan bir kod oluşturur
 */
export function generateReferralCode(userId?: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Kullanıcı ID'sinden bir tohum (seed) oluştur (eğer mevcutsa)
  let seed = Date.now();
  if (userId) {
    // Kullanıcı ID'sini sayısal bir değere dönüştür
    const idValue = userId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // Sayısal değeri kullan
    seed = seed + idValue;
  }
  
  // Rastgele üreteci kullanıcı ID'si ile tohumla
  const getRandomIndex = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.floor(seed / 233280 * characters.length);
  };
  
  // 3-3-3 formatında bir referans kodu oluştur
  const firstPart = Array(3).fill(0).map(() => characters.charAt(getRandomIndex())).join('');
  const secondPart = Array(3).fill(0).map(() => characters.charAt(getRandomIndex())).join('');
  const thirdPart = Array(3).fill(0).map(() => characters.charAt(getRandomIndex())).join('');
  
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
