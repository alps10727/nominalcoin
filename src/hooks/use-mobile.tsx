
import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Mobil cihaz algılama kancası - önbellekleme ile optimize edilmiş
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // İlk yükleme için tarayıcı genişliğini kontrol et
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // MediaQueryList kullanarak değişiklikleri dinle
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Yeniden boyutlandırma işleyicisi
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Event listener ekle (modern API)
    mql.addEventListener("change", onChange)
    
    // Temizleme fonksiyonu
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Undefined ise false döndür, aksi takdirde mevcut değeri döndür
  return !!isMobile
}
