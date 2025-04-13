
import { 
  standardizeReferralCode, 
  validateReferralCode,
  formatReferralCodeForDisplay,
  prepareReferralCodeForStorage 
} from '../referralUtils';

describe('Referral Utils', () => {
  // standardizeReferralCode testi
  test('standardizeReferralCode removes non-alphanumeric characters and converts to uppercase', () => {
    expect(standardizeReferralCode('abc-123-def')).toBe('ABC123DEF');
    expect(standardizeReferralCode('ABC 123 DEF')).toBe('ABC123DEF');
    expect(standardizeReferralCode('abc.123.def')).toBe('ABC123DEF');
    expect(standardizeReferralCode('')).toBe('');
    expect(standardizeReferralCode('   abc-123   ')).toBe('ABC123');
  });

  // validateReferralCode testi
  test('validateReferralCode validates 9-character alphanumeric codes', () => {
    expect(validateReferralCode('ABC123DEF')).toBe(true);
    expect(validateReferralCode('123456789')).toBe(true);
    expect(validateReferralCode('ABCDEFGHI')).toBe(true);
    expect(validateReferralCode('abc123def')).toBe(true); // Küçük harf olsa da çalışır
    expect(validateReferralCode('ABC-123-DEF')).toBe(true); // Tire olsa da çalışır
    
    // Geçersiz durumlar
    expect(validateReferralCode('')).toBe(false);
    expect(validateReferralCode('12345')).toBe(false); // Çok kısa
    expect(validateReferralCode('1234567890')).toBe(false); // Çok uzun
  });

  // formatReferralCodeForDisplay testi
  test('formatReferralCodeForDisplay formats code with dashes', () => {
    expect(formatReferralCodeForDisplay('ABC123DEF')).toBe('ABC-123-DEF');
    expect(formatReferralCodeForDisplay('123456789')).toBe('123-456-789');
    expect(formatReferralCodeForDisplay('abc123def')).toBe('ABC-123-DEF'); // Küçük harf bile olsa büyük harfe çevrilir
    expect(formatReferralCodeForDisplay('ABC-123-DEF')).toBe('ABC-123-DEF'); // Zaten formatlıysa aynı kalır (tireler temizlenip tekrar eklenir)
    expect(formatReferralCodeForDisplay('AB')).toBe('AB'); // 9 karakterden az ise tiresiz kalır
  });

  // prepareReferralCodeForStorage testi
  test('prepareReferralCodeForStorage standardizes code for storage', () => {
    expect(prepareReferralCodeForStorage('ABC-123-DEF')).toBe('ABC123DEF');
    expect(prepareReferralCodeForStorage('abc123def')).toBe('ABC123DEF');
    expect(prepareReferralCodeForStorage('  ABC 123 DEF  ')).toBe('ABC123DEF');
    expect(prepareReferralCodeForStorage('')).toBe('');
  });

  // Case insensitivity testi
  test('Referral code validation is case insensitive', () => {
    // "abc123def" ve "ABC123DEF" aynı koda standartlaştırılmalıdır
    const lowercase = standardizeReferralCode('abc123def');
    const uppercase = standardizeReferralCode('ABC123DEF');
    expect(lowercase).toBe(uppercase);
    
    // Büyük/küçük harf karışık giriş formatlarını kontrol et
    expect(validateReferralCode('aBc123DeF')).toBe(true);
    expect(validateReferralCode('Abc-123-dEf')).toBe(true);
  });
});
