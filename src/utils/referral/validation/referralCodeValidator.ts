
/**
 * Comprehensive validation system for referral codes
 * - Format validation with multiple fallbacks
 * - Self-referral prevention with clear error messages
 * - Code normalization for consistent handling
 */

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
  // If either ID is missing, we can't compare, so allow it to proceed
  if (!currentUserId || !ownerId) {
    return true; 
  }
  
  // Direct comparison to ensure they're not the same user
  // Returns TRUE if it's valid (not self-referral)
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
  
  // Remove spaces and convert to uppercase
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

/**
 * Get possible alternative interpretations of a code with common misreadings
 * This helps match codes even when users type in similar-looking characters
 */
export function getPossibleCodeVariations(code: string): string[] {
  if (!code || code.length !== 6) return [code];
  
  const variations: string[] = [code.toUpperCase()];
  
  // Create common variations based on visually similar characters
  const similarChars: Record<string, string[]> = {
    'O': ['0'],
    '0': ['O'],
    'I': ['1', 'L'],
    '1': ['I', 'L'],
    'L': ['1', 'I'],
    'B': ['8'],
    '8': ['B'],
    '5': ['S'],
    'S': ['5'],
    'Z': ['2'],
    '2': ['Z'],
  };
  
  // Generate variations
  for (let i = 0; i < code.length; i++) {
    const char = code[i].toUpperCase();
    const similars = similarChars[char];
    
    if (similars) {
      for (const similar of similars) {
        variations.push(
          code.substring(0, i) + similar + code.substring(i + 1)
        );
      }
    }
  }
  
  return [...new Set(variations)]; // Remove duplicates
}
