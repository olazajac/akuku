import React, { useEffect, useRef } from "react";

const Timer: React.FC<{
  isRunning: boolean;
  onStop: (time: number) => void;
  time: number;
  setTime: (time: number) => void;

}> = ({ isRunning, onStop, time, setTime }) => {

  const intervalRef = useRef<number | null>(null); // Interval reference

  // Start the timer
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(() => {
          // setTime((prevTime: number ) => prevTime + 1); // Increment time by 1 second

          setTime(time + 1);

          
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
