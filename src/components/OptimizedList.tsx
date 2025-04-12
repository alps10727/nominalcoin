
import React, { useMemo } from "react";
import { useVirtualScroll } from "@/hooks/useVirtualScroll";

interface OptimizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemKey: (item: T, index: number) => string | number;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
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
  loading = false
}: OptimizedListProps<T>) {
  const {
    visibleItems,
    scrollContainerProps,
    itemProps
  } = useVirtualScroll({
    itemCount: items.length,
    itemHeight,
    viewportHeight: height,
    overscan: 5, // Kaydırma sırasında pürüzsüz deneyim için 5 öğe önceden yükle
  });

  // Performans optimizasyonu - Görünür öğeleri useMemo ile önbelleğe al
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
  
  // Boş durum kontrolü
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
  
  // Yükleme durumu
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
    <div 
      {...scrollContainerProps} 
      className={`overflow-auto relative ${className}`}
    >
      <div style={{ height: `${items.length * itemHeight}px`, position: 'relative' }}>
        {memoizedVisibleItems}
      </div>
    </div>
  );
}

export default OptimizedList;
