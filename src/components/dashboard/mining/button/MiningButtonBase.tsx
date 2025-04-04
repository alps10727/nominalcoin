
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
 * Optimized for performance, smoothness, and reliable interaction handling
 */
export const MiningButtonBase = React.memo<MiningButtonBaseProps>(({ 
  miningActive, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled = false,
  children 
}) => {
  // State to track cooldown period after clicking
  const [cooldown, setCooldown] = useState(false);
  // Refs for handling debounce logic and tracking last click
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  
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
    
    // Skip processing if button is in cooldown, disabled, or clicked too quickly
    if (now - lastClickTimeRef.current < 3000 || cooldown || disabled) {
      console.log("Click blocked: too fast or button is in cooldown state");
      return;
    }
    
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
    }
    
    // Set timeout to reset cooldown state after 3 seconds
    timeoutRef.current = setTimeout(() => {
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setCooldown(false);
        timeoutRef.current = null;
      }
    }, 3000);
  }, [onClick, cooldown, disabled]);

  return (
    <div className="mx-auto flex items-center justify-center">
      <button 
        className={`relative w-36 h-36 rounded-full flex items-center justify-center z-10 transform transition-all duration-500 ${
          miningActive ? 'scale-110' : 'scale-100 hover:scale-105'
        } ${(disabled || cooldown) ? 'opacity-80 cursor-wait' : 'cursor-pointer'}`}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled || cooldown}
        aria-label={miningActive ? "Stop mining" : "Start mining"}
        title={miningActive ? "Stop mining" : "Start mining"}
        type="button"
      >
        {children}
      </button>
      
      {/* Visual feedback for cooldown state */}
      {cooldown && (
        <div className="absolute -bottom-6 left-0 right-0 text-center">
          <span className="text-xs text-purple-400/80 bg-navy-900/50 px-2 py-0.5 rounded-full animate-pulse">
            Please wait...
          </span>
        </div>
      )}
    </div>
  );
});

MiningButtonBase.displayName = "MiningButtonBase";
