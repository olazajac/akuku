import React, { useState, useEffect } from "react";

interface SwipeListenerProps {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  minSwipeDistance?: number; // Optional custom swipe distance
}

const SwipeListener: React.FC<SwipeListenerProps> = ({
  onSwipeRight,
  onSwipeLeft,
  minSwipeDistance = 50, // Default minimum swipe distance
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX); // Set start X position
    setTouchEndX(null); // Reset the end position
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX); // Update the end X position as the user swipes
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return; // Ignore if there's no valid swipe data

    const distance = touchEndX - touchStartX;

    // Check if the swipe is long enough to be considered a swipe
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && onSwipeRight) {
        // Right swipe
        onSwipeRight();
      } else if (distance < 0 && onSwipeLeft) {
        // Left swipe
        onSwipeLeft();
      }
    }
  };

  useEffect(() => {
    // Add touch event listeners
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [touchStartX, touchEndX, handleTouchEnd]);

  return null; // This component doesn’t render anything
};

export default SwipeListener;
