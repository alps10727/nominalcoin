
// Re-export from refactored modules to maintain backward compatibility
import { saveUserDataToFirebase } from './user/saveUserDataService';
import { updateUserCoinBalance } from './user/updateBalanceService';

export {
  saveUserDataToFirebase,
  updateUserCoinBalance
};
