
import React, { useMemo, useCallback } from "react";
import { useVirtualScroll } from "@/hooks/useVirtualScroll";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import { debugLog } from "@/utils/debugUtils";

interface OptimizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T, index: number) => string | number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  overscan?: number;
  onScrollEnd?: () => void;
  scrollToIndex?: number;
}

/**
 * Yüksek performanslı, sanal kaydırma özellikli liste bileşeni
 * Milyonlarca öğe içeren listeler için optimize edilmiştir
 */
function OptimizedList<T>({ 
  items, 
  height, 
  itemHeight, 
  renderItem, 
  itemKey,
  className = "",
  emptyMessage = "Veri bulunamadı",
  loading = false,
  overscan = 5,
  onScrollEnd,
  scrollToIndex
}: OptimizedListProps<T>) {
  // Performance optimization - track rendered items to detect unnecessary renders
  debugLog("OptimizedList", `Rendering list with ${items.length} items`);

  const handleScroll = useCallback((scrollInfo: { scrollTop: number, scrollHeight: number, clientHeight: number }) => {
    // Detect when user scrolls near the end (within 100px of bottom)
    if (onScrollEnd && 
        scrollInfo.scrollHeight - scrollInfo.scrollTop - scrollInfo.clientHeight < 100) {
      onScrollEnd();
    }
  }, [onScrollEnd]);
  
  const {
    visibleItems,
    scrollContainerProps,
    itemProps,
    scrollTo,
    startIndex,
    endIndex
  } = useVirtualScroll({
    itemCount: items.length,
    itemHeight,
    viewportHeight: height,
    overscan, // Pre-load items for smoother scrolling experience
    onScroll: handleScroll
  });

  // Scroll to specific index if requested
  React.useEffect(() => {
    if (scrollToIndex !== undefined && scrollTo) {
      scrollTo(scrollToIndex);
    }
  }, [scrollToIndex, scrollTo]);
  
  // Performance optimization - Memoize visible items
  const memoizedVisibleItems = useMemo(() => {
    return visibleItems.map(index => {
      const item = items[index];
      
      if (!item) return null;
      
      return (
        <div {...itemProps(index)} key={itemKey(item, index)}>
          {renderItem(item, index)}
        </div>
      );
    });
  }, [visibleItems, items, renderItem, itemProps, itemKey]);

  // Quick navigation buttons for extra-large lists
  const QuickNavButtons = useMemo(() => {
    if (items.length < 500) return null;
    
    return (
      <div className="fixed right-4 bottom-20 flex flex-col gap-2 z-20">
        <button 
          className="p-2 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 text-white"
          onClick={() => scrollTo(0)}
          aria-label="Listeyi başa sar"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button 
          className="p-2 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 text-white"
          onClick={() => scrollTo(Math.max(0, items.length - 10))}
          aria-label="Listeyi sona sar"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    );
  }, [items.length, scrollTo]);
  
  // Empty state check
  if (!loading && items.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center text-gray-500 ${className}`} 
        style={{ height: `${height}px` }}
      >
        {emptyMessage}
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`} 
        style={{ height: `${height}px` }}
      >
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
          <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
          <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {items.length > 0 && (
        <div className="text-xs text-gray-500 mb-1">
          Gösterilen: {startIndex + 1}-{Math.min(endIndex + 1, items.length)} / {items.length} öğe
        </div>
      )}
      <ScrollArea 
        className="overflow-auto"
        style={{ height: `${height}px` }}
        {...scrollContainerProps} 
      >
        <div style={{ height: `${items.length * itemHeight}px`, position: 'relative' }}>
          {memoizedVisibleItems}
        </div>
      </ScrollArea>
      {QuickNavButtons}
    </div>
  );
}

export default OptimizedList;
