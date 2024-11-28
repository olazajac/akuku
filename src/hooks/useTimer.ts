import { useState, useEffect, useRef, useCallback } from "react";

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    if (!isRunning && timerRef.current === null) {
      setIsRunning(true);
      timerRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  }, [isRunning]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTime(0);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer(); // Cleanup on unmount
  }, [stopTimer]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return { time, isRunning, startTimer, stopTimer, resetTimer, minutes, seconds };
};
