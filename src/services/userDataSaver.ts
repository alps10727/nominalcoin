
// Re-export from refactored modules to maintain backward compatibility
import { saveUserDataToSupabase } from './user/saveUserDataService';
import { updateUserCoinBalance } from './user/updateBalanceService';

export {
  saveUserDataToSupabase as saveUserDataToFirebase,
  updateUserCoinBalance
};
