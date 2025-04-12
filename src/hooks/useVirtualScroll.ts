
import { useRef, useState, useEffect } from 'react';

export interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  viewportHeight: number;
  overscan?: number;
  initialScrollTop?: number;
}

export interface VirtualScrollResult {
  visibleItems: number[];
  startIndex: number;
  endIndex: number;
  scrollContainerProps: {
    style: React.CSSProperties;
    onScroll: (e: React.UIEvent) => void;
  };
  itemProps: (index: number) => {
    style: React.CSSProperties;
    key: number;
  };
  scrollTo: (index: number) => void;
}

/**
 * Çok büyük listeler için yüksek performanslı sanal kaydırma kancası
 * Bu hook ile binlerce öğeyi performans sorunu olmadan görüntüleyebilirsiniz
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  viewportHeight,
  overscan = 3,
  initialScrollTop = 0
}: VirtualScrollOptions): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Görünür öğelerin başlangıç ve bitiş indekslerini hesapla
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + viewportHeight) / itemHeight) + overscan
  );
  
  // Görünür öğelerin dizisini oluştur
  const visibleItems = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, i) => startIndex + i
  );
  
  // Bir öğeye kaydır
  const scrollTo = (index: number) => {
    const top = index * itemHeight;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = top;
    }
    setScrollTop(top);
  };
  
  // Kaydırma olayını işle
  const handleScroll = (e: React.UIEvent) => {
    const { scrollTop } = e.currentTarget;
    setScrollTop(scrollTop);
  };
  
  // Önbelleğe alma ve geri yükleme
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = initialScrollTop;
    }
  }, [initialScrollTop]);
  
  return {
    visibleItems,
    startIndex,
    endIndex,
    scrollContainerProps: {
      style: {
        height: `${viewportHeight}px`,
        overflow: 'auto',
        position: 'relative',
        willChange: 'transform'
      },
      onScroll: handleScroll
    },
    itemProps: (index: number) => ({
      style: {
        position: 'absolute',
        top: 0,
        transform: `translateY(${index * itemHeight}px)`,
        height: `${itemHeight}px`,
        width: '100%'
      },
      key: index
    }),
    scrollTo
  };
}
