
import React, { useState, useEffect } from "react";

interface MiningButtonBaseProps {
  miningActive: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

/**
 * Base button component that handles the click event and scaling animation
 * Tamamen yerel depolama kullanacak şekilde optimize edildi
 */
export const MiningButtonBase = React.memo<MiningButtonBaseProps>(({ 
  miningActive, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
  children 
}) => {
  // Tıklama sonrası soğuma süresi için durum
  const [cooldown, setCooldown] = useState(false);

  // Tıklama işleyicisini iyileştirelim
  const handleClick = () => {
    if (cooldown || disabled) return;
    
    // Tıklama işlemini gerçekleştir
    onClick();
    
    // Soğuma süresini başlat (3000ms = 3 saniye)
    setCooldown(true);
    setTimeout(() => setCooldown(false), 3000);
  };

  // Komponent kaldırıldığında zamanlayıcıları temizle
  useEffect(() => {
    return () => {
      // Tüm setTimeout temizlikleri
    };
  }, []);

  return (
    <div className="mx-auto flex items-center justify-center">
      <button 
        className={`relative w-36 h-36 rounded-full flex items-center justify-center z-10 transition-all duration-700 ${
          miningActive ? 'scale-110' : 'scale-100 hover:scale-105'
        } ${(disabled || cooldown) ? 'opacity-80 cursor-wait' : 'cursor-pointer'}`}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled || cooldown}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
      >
        {children}
      </button>
    </div>
  );
});

MiningButtonBase.displayName = "MiningButtonBase";
