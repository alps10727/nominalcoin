
/**
 * Basic validation checks for referral code format
 */
export function validateReferralCodeFormat(code: string): boolean {
  if (!code || code.length !== 6) {
    return false;
  }
  
  // Check if code is alphanumeric (uppercase letters and numbers only)
  return /^[A-Z0-9]{6}$/.test(code.toUpperCase());
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
  if (!code) return null;
  
  const normalized = code.trim().toUpperCase();
  
  return validateReferralCodeFormat(normalized) ? normalized : null;
}
