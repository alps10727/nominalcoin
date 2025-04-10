
/**
 * Benzersiz referans kodu oluşturur
 * Format: XXX-XXX-XXX (X: alfanumerik karakterler)
 * Her kullanıcı için benzersiz olan bir kod oluşturur
 */
export function generateReferralCode(userId?: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Seed (tohum) oluştur, eğer userId varsa her zaman aynı kodu üretecek
  let seed = 1234567; // Varsayılan başlangıç
  
  if (userId) {
    // Kullanıcı ID'sini sayısal değere dönüştür (deterministik olarak)
    seed = userId.split('').reduce((acc, char, index) => {
      // Prime kullanarak benzersiz özellikler ekle
      const prime = 31;
      return (acc * prime + char.charCodeAt(0)) % 2147483647; // 32-bit integer sınırı
    }, seed);
  } else {
    // userId yoksa, rastgele bir tohum (seed) oluştur
    seed = Date.now() + Math.floor(Math.random() * 10000);
  }
  
  // LCG (Linear Congruential Generator) ile deterministik rastgele sayılar üret
  const getNextRandom = () => {
    // Bu katsayılar deterministik davranış için önemli
    const a = 1103515245;
    const c = 12345;
    const m = 2147483647; // 2^31 - 1
    
    seed = (a * seed + c) % m;
    return seed / m; // 0-1 arası değer
  };
  
  const getRandomIndex = () => {
    return Math.floor(getNextRandom() * characters.length);
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
 * Hata düzeltme: Kod daha toleranslı hale getirildi, büyük-küçük harf duyarsız yapıldı
 */
export function validateReferralCode(code: string): boolean {
  if (!code) return false;
  
  // Kodu standartlaştır: boşlukları temizle ve büyük harfe çevir
  const standardizedCode = code.trim().toUpperCase();
  
  // XXX-XXX-XXX formatını kontrol et (X: alfanümerik karakter)
  const pattern = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/;
  return pattern.test(standardizedCode);
}

/**
 * Referans bağlantısı oluşturur
 */
export function createReferralLink(referralCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/sign-up?ref=${referralCode}`;
}

/**
 * Referans kodunu standartlaştır (büyük harfe çevir ve boşlukları temizle)
 * Bu fonksiyon, kullanıcı girdisini temizlemek için kullanılır
 */
export function standardizeReferralCode(code: string): string {
  if (!code) return '';
  return code.trim().toUpperCase();
}
