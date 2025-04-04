
import React, { useState, useEffect, useCallback, useRef } from "react";

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
 * Performans ve zamanlama sorunlarını çözmek için optimize edildi
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
  const timeoutRef = useRef<number | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  
  // Tıklama işleyicisini performans için memoize edelim
  const handleClick = useCallback(() => {
    // Eğer mevcut zaman ile son tıklama arasında 3 saniyeden az varsa, işlemi engelle
    const now = Date.now();
    if (now - lastClickTimeRef.current < 3000 || cooldown || disabled) {
      console.log("Tıklama çok hızlı gerçekleşti veya düğme devre dışı, işlem engellendi");
      return;
    }
    
    // Son tıklama zamanını kaydet
    lastClickTimeRef.current = now;
    
    // Soğuma süresini başlat
    setCooldown(true);
    
    // Tıklama işlemini gerçekleştir
    onClick();
    
    // Zamanlayıcıyı temizle ve yenisini oluştur
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // 3 saniye sonra cooldown'u kaldır
    timeoutRef.current = window.setTimeout(() => {
      setCooldown(false);
      timeoutRef.current = null;
    }, 3000);
  }, [onClick, cooldown, disabled]);

  // Komponent kaldırıldığında zamanlayıcıları temizle
  useEffect(() => {
    // Temizleme fonksiyonu - komponent unmount olduğunda
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
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
