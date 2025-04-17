
import { useState, useCallback } from "react";
import { UserData } from "@/types/storage";
import { debugLog } from "@/utils/debugUtils";
import { calculateMiningRate } from "@/utils/miningCalculator";

/**
 * Hook for validating user data
 */
export function useUserDataValidator() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  /**
   * Validate and fix user data
   */
  const ensureValidUserData = useCallback((userData: UserData | null, userId: string): UserData => {
    if (!userData) {
      return createDefaultUserData(userId);
    }

    const errors: string[] = [];
    const validData = { ...userData };

    // Ensure essential fields
    if (validData.userId !== userId) {
      debugLog("useUserDataValidator", "User ID mismatch, fixing", { 
        storedId: validData.userId, correctId: userId 
      });
      validData.userId = userId;
      errors.push("User ID mismatch");
    }

    // Ensure numeric values
    if (typeof validData.balance !== 'number' || isNaN(validData.balance)) {
      validData.balance = 0;
      errors.push("Invalid balance");
    }

    if (typeof validData.miningRate !== 'number' || isNaN(validData.miningRate)) {
      validData.miningRate = calculateMiningRate(validData);
      errors.push("Invalid mining rate");
    }

    // Ensure timestamp
    if (!validData.lastSaved || typeof validData.lastSaved !== 'number') {
      validData.lastSaved = Date.now();
      errors.push("Invalid last saved timestamp");
    }

    // Update validation errors
    if (errors.length > 0) {
      setValidationErrors(errors);
    }

    return validData;
  }, []);

  /**
   * Create default user data
   */
  const createDefaultUserData = useCallback((userId: string): UserData => {
    return {
      userId,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false
    };
  }, []);

  return {
    validationErrors,
    ensureValidUserData,
    createDefaultUserData
  };
}
