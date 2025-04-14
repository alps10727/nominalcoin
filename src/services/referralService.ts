
/**
 * Main service file for referral system
 * This file exports functions from individual services
 */

import { findUsersByReferralCode, checkReferralCodeValidity, isCodeUnique } from "./referral/codeValidationService";
import { createCustomReferralCode } from "./referral/customCodeService";
import { generateSuggestedCode } from "./referral/codeGenerationService";
import { updateReferrerInfo } from "./referral/referrerUpdateService";
import { getUserReferralTransactions, getReferralTransactions } from "./referral/referralTransactionService";
import { logReferralTransaction } from "./referral/transactionLoggingService";

// Export all functionality from this main file
export {
  findUsersByReferralCode,
  checkReferralCodeValidity,
  isCodeUnique,
  createCustomReferralCode,
  generateSuggestedCode,
  updateReferrerInfo,
  getUserReferralTransactions,
  getReferralTransactions,
  logReferralTransaction
};
