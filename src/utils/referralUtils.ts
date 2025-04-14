
/**
 * DEPRECATED - kept for backwards compatibility only
 * This file is maintained only to maintain backward compatibility with existing code
 */

export const generateReferralCode = (): string => {
  return "DEPRECATED";
};

export const standardizeReferralCode = (code: string | undefined): string | null => {
  if (!code || typeof code !== 'string') return null;
  return code.trim().toUpperCase();
};

export const validateReferralCode = (code: string | undefined): boolean => {
  return false; // Referral system disabled
};
