
/**
 * Basic validation checks for referral code format
 */
export function validateReferralCodeFormat(code: string): boolean {
  if (!code || code.length !== 6) {
    return false;
  }
  
  // Check if code is alphanumeric (uppercase letters and numbers only)
  return /^[A-Z0-9]+$/.test(code);
}

/**
 * Check if owner can use their own referral code
 */
export function validateSelfReferral(ownerId: string | undefined, currentUserId: string | undefined): boolean {
  if (!currentUserId || !ownerId) {
    return false;
  }
  
  return ownerId !== currentUserId;
}
