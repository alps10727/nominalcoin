
export function standardizeReferralCode(code: string): string {
  if (!code) return '';
  
  // More robust cleaning - remove all non-alphanumeric characters
  const sanitizedCode = code.replace(/[^A-Za-z0-9]/g, '');
  
  // Always convert to uppercase after sanitization
  return sanitizedCode.trim().toUpperCase();
}

export function validateReferralCode(code: string): boolean {
  if (!code) return false;
  
  // Standardize the code first
  const standardizedCode = standardizeReferralCode(code);
  
  // Ensure the code is exactly 9 characters long after sanitization
  return standardizedCode.length === 9 && /^[A-Z0-9]{9}$/.test(standardizedCode);
}

export function formatReferralCodeForDisplay(code: string): string {
  if (!code) return '';
  
  // Sanitize and standardize first
  const cleanCode = standardizeReferralCode(code);
  
  // If less than 9 characters, return as is
  if (cleanCode.length < 9) return cleanCode;
  
  // Format with dashes
  return `${cleanCode.slice(0, 3)}-${cleanCode.slice(3, 6)}-${cleanCode.slice(6, 9)}`;
}
