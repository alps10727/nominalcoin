
/**
 * Referral code utilities for standardization and validation
 */

/**
 * Standardizes a referral code by removing non-alphanumeric characters and converting to uppercase
 */
export function standardizeReferralCode(code: string): string {
  if (!code) return '';
  
  // More robust cleaning - remove all non-alphanumeric characters
  const sanitizedCode = code.replace(/[^A-Za-z0-9]/g, '');
  
  // Always convert to uppercase after sanitization
  return sanitizedCode.trim().toUpperCase();
}

/**
 * Validates if a referral code is in the correct format
 * New format: 3 letters followed by 3 numbers (e.g., ABC123)
 */
export function validateReferralCode(code: string): boolean {
  if (!code) return true; // Empty code is valid (optional)
  
  // Standardize the code first (which will convert to uppercase)
  const standardizedCode = standardizeReferralCode(code);
  
  // If empty, it's valid
  if (standardizedCode === '') return true;
  
  // Validate the new format: 3 letters followed by 3 numbers
  return /^[A-Z]{3}\d{3}$/.test(standardizedCode);
}

/**
 * Validates if an input referral code matches a stored code (case-insensitive)
 */
export function validateReferralMatch(inputCode: string, storedCode: string): boolean {
  if (!inputCode || !storedCode) return false;
  
  // Standardize both codes to ensure case-insensitive comparison
  const standardizedInput = standardizeReferralCode(inputCode);
  const standardizedStored = standardizeReferralCode(storedCode);
  
  // Compare the standardized codes
  return standardizedInput === standardizedStored;
}

/**
 * Formats a referral code for display with dashes
 * Example: ABC123 remains as ABC123 (no dashes in new format)
 */
export function formatReferralCodeForDisplay(code: string): string {
  if (!code) return '';
  
  // Sanitize and standardize first (which will convert to uppercase)
  return standardizeReferralCode(code);
}

/**
 * Prepares a referral code for storage by standardizing it
 * This removes spaces and converts to uppercase
 */
export function prepareReferralCodeForStorage(code: string): string {
  return standardizeReferralCode(code);
}

/**
 * Generates a random referral code in the format 3 letters + 3 digits
 * @returns A standardized code that follows the format AAA000
 */
export function generateReferralCode(): string {
  // Generate 3 random letters
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluding I and O for readability
  let lettersPart = '';
  for (let i = 0; i < 3; i++) {
    lettersPart += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 3 random digits
  const digits = '0123456789';
  let digitsPart = '';
  for (let i = 0; i < 3; i++) {
    digitsPart += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  // Combine letters and digits
  return lettersPart + digitsPart;
}

/**
 * Creates a referral link for sharing
 * @param code The referral code to include in the link
 * @returns A complete referral link
 */
export function createReferralLink(code: string): string {
  if (!code) return window.location.origin + '/sign-up';
  
  const baseUrl = window.location.origin + '/sign-up';
  const standardCode = standardizeReferralCode(code);
  
  return `${baseUrl}?ref=${standardCode}`;
}

/**
 * Calculate referral mining bonus for testing
 * @param referralCount Number of referrals
 * @param baseRate Base mining rate
 * @param bonusPerReferral Bonus rate per referral
 * @returns Total mining rate
 */
export function calculateReferralBonus(
  referralCount: number,
  baseRate: number = 0.001,
  bonusPerReferral: number = 0.0001
): number {
  // Calculate total mining rate with fixed precision
  return parseFloat((baseRate + Math.min(referralCount, 10) * bonusPerReferral).toFixed(4));
}
