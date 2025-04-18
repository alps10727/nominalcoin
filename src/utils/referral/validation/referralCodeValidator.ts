
/**
 * Basic validation checks for referral code format
 */
export function validateReferralCodeFormat(code: string): boolean {
  if (!code || code.trim() === '') {
    return false;
  }
  
  const trimmedCode = code.trim();
  
  // Check length (codes must be exactly 6 characters)
  if (trimmedCode.length !== 6) {
    return false;
  }
  
  // Check if code contains only valid characters (A-Z, 2-9)
  // Avoid confusing characters like 0, 1, O, I
  return /^[A-HJ-NP-Z2-9]+$/.test(trimmedCode.toUpperCase());
}

/**
 * Check if owner can use their own referral code
 */
export function validateSelfReferral(ownerId: string | undefined, currentUserId: string | undefined): boolean {
  if (!currentUserId || !ownerId) {
    return true; // If we can't determine, assume it's valid
  }
  
  return ownerId !== currentUserId;
}

/**
 * Check if format is valid and normalize
 */
export function normalizeReferralCode(code: string | null): string | null {
  if (!code || code.trim() === '') return null;
  
  const normalized = code.trim().toUpperCase();
  
  return validateReferralCodeFormat(normalized) ? normalized : null;
}
