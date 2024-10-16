import React, { useEffect, useRef, useState } from "react";

const Timer: React.FC<{
  isRunning: boolean;
  onStop: (time: number) => void;
}> = ({ isRunning, onStop }) => {
  const [time, setTime] = useState(0); // Actual time displayed
  const intervalRef = useRef<number | null>(null); // Interval reference

  // Start the timer
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(() => {
          setTime((prevTime) => prevTime + 1); // Increment time by 1 second
        }, 1000);
      }
    } else if (!isRunning && intervalRef.current !== null) {
      // Stop the timer
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      onStop(time); // Pass the total time when stopped
    }

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return <div>Time: {time}s</div>; // Display the time
};

export default Timer;
