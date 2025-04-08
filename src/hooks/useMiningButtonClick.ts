
import { useState, useCallback, useRef, useEffect } from "react";

interface UseMiningButtonClickOptions {
  onClick: () => void;
  disabled?: boolean;
  cooldownTime?: number;
}

/**
 * Custom hook to handle mining button click with debounce and cooldown
 */
export function useMiningButtonClick({
  onClick,
  disabled = false,
  cooldownTime = 3000
}: UseMiningButtonClickOptions) {
  // State to track cooldown period after clicking
  const [cooldown, setCooldown] = useState(false);
  
  // Refs for handling debounce logic and tracking last click
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  const isProcessingClickRef = useRef<boolean>(false);
  
  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);
  
  // Memoized click handler with improved debounce logic
  const handleClick = useCallback(() => {
    // Get current time for debounce comparison
    const now = Date.now();
    
    // Skip processing if button is in cooldown, disabled, or clicked too quickly, or if we're already processing a click
    if (now - lastClickTimeRef.current < cooldownTime || cooldown || disabled || isProcessingClickRef.current) {
      console.log("Click blocked: too fast, button is in cooldown state, or click is already being processed");
      return;
    }
    
    // Set processing flag to prevent concurrent clicks
    isProcessingClickRef.current = true;
    
    // Update last click time
    lastClickTimeRef.current = now;
    
    // Enter cooldown state
    setCooldown(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Call the actual click handler
    try {
      onClick();
    } catch (err) {
      console.error("Error during button click handler:", err);
    } finally {
      // Always reset the processing flag
      isProcessingClickRef.current = false;
    }
    
    // Set timeout to reset cooldown state after the cooldown period
    timeoutRef.current = setTimeout(() => {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setCooldown(false);
        timeoutRef.current = null;
      }
    }, cooldownTime);
  }, [onClick, cooldown, disabled, cooldownTime]);

  return {
    handleClick,
    cooldown,
    isDisabled: disabled || cooldown
  };
}
