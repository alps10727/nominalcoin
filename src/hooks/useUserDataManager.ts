
// Mock function for backward compatibility
export function useUserDataManager() {
  const saveData = async () => {
    console.log("Saving user data...");
    return true;
  };
  
  const loadData = async () => {
    console.log("Loading user data...");
    return {
      balance: 100,
      miningRate: 0.003
    };
  };
  
  return {
    saveData,
    loadData
  };
}
