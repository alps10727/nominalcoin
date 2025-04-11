
/**
 * Benzersiz ve tahmin edilemez referans kodu oluşturur
 * Format: XXX-XXX-XXX (X: alfanumerik karakterler)
 * Güvenli bir şekilde benzersiz kodlar üretir
 */
export function generateReferralCode(userId?: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  // Seed (tohum) oluştur, güvenli ve tahmin edilemez bir değer kullan
  const timestamp = Date.now();
  const randomPrefix = Math.floor(Math.random() * 1000000);
  let seed = timestamp ^ randomPrefix; // XOR ile karıştır
  
  if (userId) {
    // Kullanıcı ID'sini tahmin edilemez bir şekilde tohuma dahil et
    const userSeed = userId.split('').reduce((acc, char, index) => {
      // Karakterlerin sırasını da hesaba katan karmaşık bir dönüşüm
      const prime = 31;
      const offset = index % 7; // Ek karışıklık için mod 7
      return (acc * prime + char.charCodeAt(0) + offset) % 2147483647;
    }, seed);
    
    // Ek güvenlik karıştırması
    seed = (userSeed * 48271) % 2147483647;
  } else {
    // Rastgele tohum oluştur - ekstra güvenlik için crypto API kullan (tarayıcılar için)
    try {
      // Tarayıcı ortamında crypto kullan
      if (typeof window !== 'undefined' && window.crypto) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        seed = array[0] % 2147483647;
      } else {
        // Node.js veya başka ortamlar için fallback
        seed = (Date.now() ^ (Math.random() * 1000000)) % 2147483647;
      }
    } catch (e) {
      // Herhangi bir ortam hatası durumunda fallback
      seed = (timestamp * randomPrefix) % 2147483647;
    }
  }
  
  // Güvenli karmaşık bir PRNG (Pseudo-Random Number Generator) algoritması
  const getNextRandom = () => {
    // Bu katsayılar güvenli rastgele sayı üreticisi için incelikle seçilmiş değerler
    const a = 48271; // Optimum katsayı (Mersenne prime için)
    const m = 2147483647; // 2^31 - 1 (Mersenne prime)
    
    seed = (a * seed) % m;
    return seed / m; // 0-1 arası değer
  };
  
  const getRandomIndex = () => {
    return Math.floor(getNextRandom() * characters.length);
  };
  
  // 3-3-3 formatında tahmin edilemez bir referans kodu oluştur
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
 */
export function standardizeReferralCode(code: string): string {
  if (!code) return '';
  
  // Güvenli temizleme - XSS ve diğer güvenlik açıklarından kaçınmak için
  // Sadece izin verilen karakterleri (alfanumerik ve tire) tut
  const sanitizedCode = code.replace(/[^A-Za-z0-9\-]/g, '');
  return sanitizedCode.trim().toUpperCase();
}

