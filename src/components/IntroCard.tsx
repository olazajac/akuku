import React from "react";
import Button from "./Button";

interface IntroCardProps {
  mode: string;
  setMode: (mode: string) => void;
  setStatus: (status: string) => void;
  startTimer: () => void;
}

const IntroCard: React.FC<IntroCardProps> = ({
  setMode,
  setStatus,
  mode,
  startTimer,

}) => {
  return (
    <div className="grid gap-4 grid-cols-2 w-full pt-5 pb-5">
     
    

      <Button
        text="Learn"
        backgroundColor="bg-green-600 hover:bg-green-700 py-8"
        textColor="text-white"
        onClick={() => {
          setMode("learn");
          console.log(mode);
          setStatus("active");
          startTimer()
        }}
      />

<Button
        text="Test"
        backgroundColor="bg-green-600 hover:bg-green-700 py-8"
        textColor="text-white"
        onClick={() => {
          setStatus("active");
          setMode("test");
          console.log(mode);
          startTimer()
        }}
      />

      
    </div>
  );
};

export default IntroCard;
