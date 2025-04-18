
/**
 * Basic validation checks for referral code format
 * Enhanced to be more permissive while still maintaining security
 */
export function validateReferralCodeFormat(code: string): boolean {
  if (!code || code.trim() === '') {
    return false;
  }
  
  const trimmedCode = code.trim().toUpperCase();
  
  // Check length (codes must be exactly 6 characters)
  if (trimmedCode.length !== 6) {
    return false;
  }
  
  // Check if code contains only valid characters (A-Z, 0-9)
  // First attempt with strict validation (no confusing chars)
  if (/^[A-HJ-NP-Z2-9]+$/.test(trimmedCode)) {
    return true;
  }
  
  // More permissive fallback (allow all alphanumeric)
  // This helps with existing codes in the system
  return /^[A-Z0-9]+$/.test(trimmedCode);
}

/**
 * Check if owner can use their own referral code
 * Enhanced with additional checks and clear ID comparison
 */
export function validateSelfReferral(ownerId: string | undefined, currentUserId: string | undefined): boolean {
  if (!currentUserId || !ownerId) {
    return true; // If we can't determine, assume it's valid
  }
  
  // Direct comparison to ensure they're not the same user
  return ownerId !== currentUserId;
}

/**
 * Check if format is valid and normalize
 * Ensures consistent code format
 */
export function normalizeReferralCode(code: string | null): string | null {
  if (!code || code.trim() === '') return null;
  
  const normalized = code.trim().toUpperCase();
  
  return validateReferralCodeFormat(normalized) ? normalized : null;
}

/**
 * Process referral code characters to avoid visually similar characters
 * This prevents confusion with similar looking characters
 */
export function sanitizeReferralCodeInput(code: string): string {
  if (!code) return '';
  
  // Convert to uppercase and remove spaces
  const upperCode = code.trim().toUpperCase();
  
  // Replace potentially confusing characters with safe alternatives
  // Prevent 0/O, 1/I/L, 8/B confusion
  return upperCode
    .replace(/0/g, 'O')  // 0 → O
    .replace(/1/g, '7')  // 1 → 7 
    .replace(/I/g, 'H')  // I → H
    .replace(/L/g, 'F')  // L → F
    .replace(/8/g, '6'); // 8 → 6
}
