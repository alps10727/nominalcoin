import React, { useMemo, useCallback } from "react";
import { FixedSizeList, VariableSizeList, ListChildComponentProps } from "react-window";
import { ChevronDown, ChevronUp } from "lucide-react";
import { debugLog } from "@/utils/debugUtils";

interface OptimizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number | ((index: number) => number); // Sabit veya dinamik yükseklik desteği
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T, index: number) => string | number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  overscan?: number;
  onScrollEnd?: () => void;
  scrollToIndex?: number;
  useVariableHeight?: boolean; // Değişken yükseklik için
}

/**
 * Yüksek performanslı, react-window tabanlı liste bileşeni
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
  scrollToIndex,
  useVariableHeight = false
}: OptimizedListProps<T>) {
  
  // Performance logging
  debugLog("OptimizedList", `Rendering list with ${items.length} items, useVariableHeight: ${useVariableHeight}`);

  // Memoize scroll handler
  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: 
    { scrollOffset: number; scrollUpdateWasRequested: boolean }) => {
    if (!scrollUpdateWasRequested && onScrollEnd && items.length > 0) {
      const totalSize = typeof itemHeight === 'number' 
        ? items.length * itemHeight 
        : items.reduce((total, _, i) => total + (itemHeight as (index: number) => number)(i), 0);
      
      if (scrollOffset > totalSize - height - 100) {
        debugLog("OptimizedList", "Reached scroll threshold, calling onScrollEnd");
        onScrollEnd();
      }
    }
  }, [onScrollEnd, items.length, itemHeight, height]);

  // Memoize row renderer
  const Row = useCallback(({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    if (!item) return null;
    
    const key = itemKey(item, index);
    debugLog("OptimizedList", `Rendering row ${index} with key ${key}`);
    
    return (
      <div style={style} key={key}>
        {renderItem(item, index)}
      </div>
    );
  }, [items, renderItem, itemKey]);

  // Memoize the row component
  const MemoizedRow = useMemo(() => React.memo(Row), [Row]);

  // Memoize navigation buttons
  const QuickNavButtons = useMemo(() => {
    if (items.length < 500) return null;
    
    return (
      <div className="fixed right-4 bottom-20 flex flex-col gap-2 z-20">
        <button 
          className="p-2 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 text-white"
          onClick={() => listRef.current?.scrollToItem(0, "start")}
          aria-label="Listeyi başa sar"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button 
          className="p-2 bg-purple-600 rounded-full shadow-lg hover:bg-purple-700 text-white"
          onClick={() => listRef.current?.scrollToItem(items.length - 1, "end")}
          aria-label="Listeyi sona sar"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    );
  }, [items.length]);

  // List reference
  const listRef = React.useRef<FixedSizeList | VariableSizeList>(null);
  
  // Scroll to index effect
  React.useEffect(() => {
    if (scrollToIndex !== undefined && listRef.current) {
      debugLog("OptimizedList", `Scrolling to index ${scrollToIndex}`);
      listRef.current.scrollToItem(scrollToIndex, "start");
    }
  }, [scrollToIndex]);

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
          Toplam: {items.length} öğe
        </div>
      )}
      
      <div style={{ height: `${height}px` }}>
        {useVariableHeight ? (
          <VariableSizeList
            ref={listRef as React.RefObject<VariableSizeList>}
            height={height}
            itemCount={items.length}
            itemSize={itemHeight as (index: number) => number}
            width="100%"
            overscanCount={overscan}
            onScroll={handleScroll}
            className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
          >
            {MemoizedRow}
          </VariableSizeList>
        ) : (
          <FixedSizeList
            ref={listRef as React.RefObject<FixedSizeList>}
            height={height}
            itemCount={items.length}
            itemSize={itemHeight as number}
            width="100%"
            overscanCount={overscan}
            onScroll={handleScroll}
            className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
          >
            {MemoizedRow}
          </FixedSizeList>
        )}
      </div>
      
      {QuickNavButtons}
    </div>
  );
}

// Prevent unnecessary re-renders of the entire list component
export default React.memo(OptimizedList);
