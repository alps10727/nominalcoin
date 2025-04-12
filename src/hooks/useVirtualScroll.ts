
import { useRef, useState, useEffect, useCallback } from 'react';

// NOT: Bu hook artık OptimizedList tarafından doğrudan kullanılmamaktadır.
// React-window kütüphanesi ile değiştirilmiştir, ancak geriye dönük uyumluluk için korunmaktadır.

export interface VirtualScrollOptions {
  itemCount: number;
  itemHeight: number;
  viewportHeight: number;
  overscan?: number;
  initialScrollTop?: number;
  onScroll?: (scrollInfo: { scrollTop: number, scrollHeight: number, clientHeight: number }) => void;
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
 * 
 * @deprecated Bu hook react-window ile değiştirilmiştir. Doğrudan react-window kullanın.
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  viewportHeight,
  overscan = 3,
  initialScrollTop = 0,
  onScroll
}: VirtualScrollOptions): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(initialScrollTop);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Calculate visible items' start and end indices
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + viewportHeight) / itemHeight) + overscan
  );
  
  // Create array of visible items
  const visibleItems = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, i) => startIndex + i
  ).filter(index => index >= 0 && index < itemCount); // Ensure indices are within bounds
  
  // Scroll to specific item
  const scrollTo = useCallback((index: number) => {
    const top = Math.max(0, index * itemHeight);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = top;
    }
    setScrollTop(top);
  }, [itemHeight]);
  
  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    
    setScrollTop(scrollTop);
    
    // Call external scroll handler if provided
    if (onScroll) {
      onScroll({
        scrollTop,
        scrollHeight: target.scrollHeight,
        clientHeight: target.clientHeight
      });
    }
  }, [onScroll]);
  
  // Restore scroll position on remount or initialization
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
        willChange: 'transform',
        WebkitOverflowScrolling: 'touch' // Improve mobile scrolling
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
