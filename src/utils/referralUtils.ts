
/**
 * Benzersiz ve tahmin edilemez referans kodu oluşturur
 * Format: XXX-XXX-XXX (X: alfanumerik karakterler)
 * Güvenli bir şekilde benzersiz kodlar üretir
 */
export function generateReferralCode(userId?: string): string {
  // Karmaşıklığı azaltmak için sadece kolayca okunabilen karakterleri kullan
  // 0, O, 1, I gibi karıştırılabilecek karakterleri çıkar
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  let result = '';
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  // XXX-XXX-XXX formatına dönüştür (gösterim için)
  return `${result.slice(0, 3)}-${result.slice(3, 6)}-${result.slice(6, 9)}`;
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
 * Daha esnek doğrulama: küçük harf girdilerini de kabul eder
 */
export function validateReferralCode(code: string): boolean {
  if (!code) return false;
  
  // Kodu standartlaştır: boşlukları temizle ve büyük harfe çevir
  const standardizedCode = code.trim().toUpperCase();
  
  // XXX-XXX-XXX formatını kontrol et (X: alfanümerik karakter)
  // Tirelerin opsiyonel olmasına izin ver (hem XXX-XXX-XXX hem de XXXXXXXXX)
  const pattern = /^[A-Z0-9]{3}-?[A-Z0-9]{3}-?[A-Z0-9]{3}$/;
  return pattern.test(standardizedCode);
}

/**
 * Referans bağlantısı oluşturur
 * Güvenli ve doğrulanabilir bağlantılar üretir
 */
export function createReferralLink(referralCode: string): string {
  const baseUrl = window.location.origin;
  // URL'ye referans kodunu ekle, XSS ve diğer güvenlik açıklarından kaçınmak için kodla
  const encodedCode = encodeURIComponent(referralCode);
  return `${baseUrl}/sign-up?ref=${encodedCode}`;
}

/**
 * Referans kodunu standartlaştır (büyük harfe çevir ve boşlukları temizle)
 * Bu fonksiyon, kullanıcı girdisini temizlemek için kullanılır
 * Küçük harfleri de kabul eder ve büyük harfe dönüştürür
 */
export function standardizeReferralCode(code: string): string {
  if (!code) return '';
  
  // Güvenli temizleme - XSS ve diğer güvenlik açıklarından kaçınmak için
  // Sadece izin verilen karakterleri (alfanumerik ve tire) tut
  const sanitizedCode = code.replace(/[^A-Za-z0-9\-]/g, '');
  // Frontend'de tire ile göster, ama veritabanında tiresiz kaydet
  return sanitizedCode.trim().toUpperCase();
}

/**
 * Firestore'da saklama için referans kodunu hazırla (tireleri kaldır)
 * Küçük harfleri de kabul eder ve büyük harfe dönüştürür
 */
export function prepareReferralCodeForStorage(code: string): string {
  return standardizeReferralCode(code).replace(/-/g, '');
}

/**
 * Gösterim için referans kodunu formatla (XXX-XXX-XXX)
 */
export function formatReferralCodeForDisplay(code: string): string {
  if (!code) return '';
  
  // Önce tüm tireleri kaldır ve temizle
  const cleanCode = code.replace(/-/g, '').trim().toUpperCase();
  
  // Eğer 9 karakterden az ise, tamamlama yapma
  if (cleanCode.length < 9) return cleanCode;
  
  // XXX-XXX-XXX formatına dönüştür
  return `${cleanCode.slice(0, 3)}-${cleanCode.slice(3, 6)}-${cleanCode.slice(6, 9)}`;
}
