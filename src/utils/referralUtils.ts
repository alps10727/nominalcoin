
/**
 * Referral code utilities for standardization and validation
 */

/**
 * Standardizes a referral code by removing spaces and converting to uppercase
 */
export function standardizeReferralCode(code: string): string {
  if (!code) return '';
  return code.trim().toUpperCase();
}

/**
 * Validates if a referral code is in the correct format
 * Format: 3 letters followed by 3 numbers (e.g., ABC123)
 */
export function validateReferralCode(code: string): boolean {
  if (!code) return true; // Empty code is valid (optional)
  const standardizedCode = standardizeReferralCode(code);
  if (standardizedCode === '') return true;
  return /^[A-Z]{3}\d{3}$/.test(standardizedCode);
}

/**
 * Validates if an input referral code matches a stored code
 */
export function validateReferralMatch(inputCode: string, storedCode: string): boolean {
  if (!inputCode || !storedCode) return false;
  return standardizeReferralCode(inputCode) === standardizeReferralCode(storedCode);
}

/**
 * Formats a referral code for display (no dashes in new format)
 */
export function formatReferralCodeForDisplay(code: string): string {
  return standardizeReferralCode(code);
}

/**
 * Prepares a referral code for storage
 */
export function prepareReferralCodeForStorage(code: string): string {
  return standardizeReferralCode(code);
}

/**
 * Generates a random referral code (3 letters + 3 digits)
 */
export function generateReferralCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluding I and O for readability
  const digits = '0123456789';
  
  let lettersPart = '';
  for (let i = 0; i < 3; i++) {
    lettersPart += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  let digitsPart = '';
  for (let i = 0; i < 3; i++) {
    digitsPart += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  return lettersPart + digitsPart;
}

/**
 * Creates a referral link for sharing
 */
export function createReferralLink(code: string): string {
  const baseUrl = window.location.origin + '/sign-up';
  if (!code) return baseUrl;
  const standardCode = standardizeReferralCode(code);
  return `${baseUrl}?ref=${standardCode}`;
}
