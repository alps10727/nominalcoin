
/**
 * Basic validation checks for referral code format
 */
export function validateReferralCodeFormat(code: string): boolean {
  if (!code || code.trim() === '') {
    return false;
  }
  
  const trimmedCode = code.trim();
  
  // Check length (typical codes are 6 characters, but allow up to 10 for flexibility)
  if (trimmedCode.length < 3 || trimmedCode.length > 10) {
    return false;
  }
  
  // Check if code is alphanumeric (uppercase letters and numbers only)
  // This is a more permissive validation to catch common issues while avoiding false negatives
  return /^[A-Z0-9]+$/.test(trimmedCode.toUpperCase());
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
