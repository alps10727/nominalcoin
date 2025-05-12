
import { Mission } from "@/types/missions";

/**
 * Varsayılan görevleri döndüren fonksiyon
 */
export const getDefaultMissions = (): Mission[] => {
  return [
    {
      id: "mining-boost",
      title: "Kazım Hızı Arttırma",
      description: "1 saatliğine kazım hızınızı arttırın",
      icon: "trending-up", // Changed to string icon name
      progress: 0,
      total: 1,
      reward: 5,
      claimed: false,
      cooldownEnd: null
    },
    {
      id: "purchase-reward",
      title: "Satın Alma Bonusu",
      description: "Herhangi bir satın alma yaparak bonus NC kazanın",
      icon: "shopping-cart", // Changed to string icon name
      progress: 0,
      total: 1,
      reward: 100,
      claimed: false,
      cooldownEnd: null
    },
    {
      id: "wheel-of-fortune",
      title: "Şans Çarkı",
      description: "Çarkı çevirerek ödül kazanın",
      icon: "clock", // Changed to string icon name
      progress: 0,
      total: 1,
      reward: 0, // Çark ödülü değişken olduğu için 0
      claimed: false,
      cooldownEnd: null
    },
  ];
};
