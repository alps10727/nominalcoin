
import React from "react";

interface OfflineIndicatorProps {
  show: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="bg-orange-500/80 text-white text-center text-sm py-1.5 px-2 shadow-sm">
      Çevrimdışı moddasınız. Senkronizasyon internet bağlantısıyla yeniden sağlanacak.
    </div>
  );
};
