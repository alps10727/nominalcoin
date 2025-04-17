
// Re-export everything from the refactored modules
export { POOL_CAPACITY, getPool, getUserData } from './poolHelpers';
export { createPool } from './poolCreator';
export { 
  updateUserPoolMembership, 
  checkPoolRequirements,
  joinPool, 
  leavePool 
} from './membershipService';
export { calculateMiningRate, updateUserRank } from './rankService';
export { getAllPools } from './poolQuery';

// Note: The old poolService.ts can now be deleted as all functionality
// has been moved to the new modules
