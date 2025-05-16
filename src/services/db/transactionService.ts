
/**
 * This is a re-export file for transaction services
 * It exports functions from the transaction/ directory for backwards compatibility
 */

export { runAtomicTransaction, runReferralTransaction } from './transaction';

// Log a deprecation warning (only in development)
if (process.env.NODE_ENV === 'development') {
  console.warn(
    '[DEPRECATED] Direct imports from transactionService.ts are deprecated. ' +
    'Please import these functions from src/services/db/transaction instead.'
  );
}
