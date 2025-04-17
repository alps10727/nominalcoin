
// Mock helpers and functions to replace Firebase functionality

export const POOL_CAPACITY = {
  1: 100,
  2: 250,
  3: 500
};

export function getPool(poolId: string) {
  console.log("Getting pool info for:", poolId);
  return {
    poolId,
    name: "Mock Pool",
    description: "This is a mock pool",
    level: 1,
    owner: "user123",
    memberCount: 1,
    createdAt: new Date(),
    capacity: 100,
    isPublic: true,
    minRequirements: {
      minBalance: 0,
      miningDays: 0
    }
  };
}

export function getUserData(userId: string) {
  return {
    userId,
    balance: 100,
    miningRate: 0.003,
    lastSaved: Date.now()
  };
}

export async function createPool(poolData: any, userId: string) {
  const poolId = `${poolData.name?.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`;
  console.log("Creating pool:", poolId);
  return poolId;
}

export async function updateUserPoolMembership(userId: string, poolId: string) {
  console.log("Updating user pool membership:", userId, poolId);
  return true;
}

export async function checkPoolRequirements(userId: string, poolId: string) {
  return true;
}

export async function joinPool(userId: string, poolId: string) {
  console.log("User", userId, "joining pool", poolId);
  return true;
}

export async function leavePool(userId: string) {
  console.log("User", userId, "leaving current pool");
  return true;
}

export async function calculateMiningRate(userData: any) {
  return 0.005;
}

export async function updateUserRank(userId: string) {
  return "Rookie";
}

export async function getAllPools(filter: { isPublic: boolean } = { isPublic: true }) {
  return [
    {
      poolId: "public-pool-123456",
      name: "Public Pool",
      description: "A pool for everyone",
      level: 1,
      owner: "system",
      memberCount: 50,
      createdAt: new Date(),
      capacity: 100,
      isPublic: true,
      minRequirements: {
        minBalance: 0,
        miningDays: 0
      }
    }
  ];
}
