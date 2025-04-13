
import { 
  standardizeReferralCode, 
  validateReferralCode,
  formatReferralCodeForDisplay,
  prepareReferralCodeForStorage 
} from '../referralUtils';

// Add these imports for Jest testing
import { describe, test, expect } from '@jest/globals';

describe('Referral Utils', () => {
  // standardizeReferralCode test
  test('standardizeReferralCode removes non-alphanumeric characters and converts to uppercase', () => {
    expect(standardizeReferralCode('abc-123-def')).toBe('ABC123DEF');
    expect(standardizeReferralCode('ABC 123 DEF')).toBe('ABC123DEF');
    expect(standardizeReferralCode('abc.123.def')).toBe('ABC123DEF');
    expect(standardizeReferralCode('')).toBe('');
    expect(standardizeReferralCode('   abc-123   ')).toBe('ABC123');
  });

  // validateReferralCode test
  test('validateReferralCode validates 9-character alphanumeric codes', () => {
    expect(validateReferralCode('ABC123DEF')).toBe(true);
    expect(validateReferralCode('123456789')).toBe(true);
    expect(validateReferralCode('ABCDEFGHI')).toBe(true);
    expect(validateReferralCode('abc123def')).toBe(true); // Works with lowercase
    expect(validateReferralCode('ABC-123-DEF')).toBe(true); // Works with dashes
    
    // Invalid cases
    expect(validateReferralCode('')).toBe(false);
    expect(validateReferralCode('12345')).toBe(false); // Too short
    expect(validateReferralCode('1234567890')).toBe(false); // Too long
  });

  // formatReferralCodeForDisplay test
  test('formatReferralCodeForDisplay formats code with dashes', () => {
    expect(formatReferralCodeForDisplay('ABC123DEF')).toBe('ABC-123-DEF');
    expect(formatReferralCodeForDisplay('123456789')).toBe('123-456-789');
    expect(formatReferralCodeForDisplay('abc123def')).toBe('ABC-123-DEF'); // Converts to uppercase
    expect(formatReferralCodeForDisplay('ABC-123-DEF')).toBe('ABC-123-DEF'); // Already formatted
    expect(formatReferralCodeForDisplay('AB')).toBe('AB'); // Less than 9 characters
  });

  // prepareReferralCodeForStorage test
  test('prepareReferralCodeForStorage standardizes code for storage', () => {
    expect(prepareReferralCodeForStorage('ABC-123-DEF')).toBe('ABC123DEF');
    expect(prepareReferralCodeForStorage('abc123def')).toBe('ABC123DEF');
    expect(prepareReferralCodeForStorage('  ABC 123 DEF  ')).toBe('ABC123DEF');
    expect(prepareReferralCodeForStorage('')).toBe('');
  });

  // Case insensitivity test
  test('Referral code validation is case insensitive', () => {
    // "abc123def" and "ABC123DEF" should be the same standardized code
    const lowercase = standardizeReferralCode('abc123def');
    const uppercase = standardizeReferralCode('ABC123DEF');
    expect(lowercase).toBe(uppercase);
    
    // Check mixed case input formats
    expect(validateReferralCode('aBc123DeF')).toBe(true);
    expect(validateReferralCode('Abc-123-dEf')).toBe(true);
  });
});

