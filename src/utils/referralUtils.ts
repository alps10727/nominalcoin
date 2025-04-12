
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
 * Valid codes are 9 characters long and contain only uppercase letters and numbers
 */
export function validateReferralCode(code: string): boolean {
  if (!code) return false;
  
  // Standardize the code first
  const standardizedCode = standardizeReferralCode(code);
  
  // Ensure the code is exactly 9 characters long after sanitization
  return standardizedCode.length === 9 && /^[A-Z0-9]{9}$/.test(standardizedCode);
}

/**
 * Formats a referral code for display with dashes
 * Example: ABC123DEF becomes ABC-123-DEF
 */
export function formatReferralCodeForDisplay(code: string): string {
  if (!code) return '';
  
  // Sanitize and standardize first
  const cleanCode = standardizeReferralCode(code);
  
  // If less than 9 characters, return as is
  if (cleanCode.length < 9) return cleanCode;
  
  // Format with dashes
  return `${cleanCode.slice(0, 3)}-${cleanCode.slice(3, 6)}-${cleanCode.slice(6, 9)}`;
}

/**
 * Prepares a referral code for storage by standardizing it
 * This removes dashes, spaces, and converts to uppercase
 */
export function prepareReferralCodeForStorage(code: string): string {
  return standardizeReferralCode(code);
}

/**
 * Generates a referral code based on a user ID
 * @param userId The user ID to base the referral code on
 * @returns A 9-character referral code
 */
export function generateReferralCode(userId: string | undefined): string {
  if (!userId) return '';
  
  // Use the first 5 chars of userId + 4 random chars
  const userPart = userId.slice(0, 5).toUpperCase();
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  // Ensure we have exactly 9 characters
  const combined = (userPart + randomChars).slice(0, 9);
  
  // Pad with random characters if needed
  const paddingNeeded = 9 - combined.length;
  const padding = paddingNeeded > 0 
    ? Math.random().toString(36).substring(2, 2 + paddingNeeded).toUpperCase()
    : '';
    
  return (combined + padding).slice(0, 9);
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
