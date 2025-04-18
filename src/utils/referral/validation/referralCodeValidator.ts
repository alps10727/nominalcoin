
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
  
  // More permissive validation that accepts all alphanumeric characters
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
 * Process referral code characters 
 */
export function sanitizeReferralCodeInput(code: string): string {
  if (!code) return '';
  
  // Just uppercase and trim - don't replace characters
  return code.trim().toUpperCase();
}

/**
 * Get possible alternative interpretations of a code with common misreadings
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
    'S': ['5'],
    '5': ['S'],
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
