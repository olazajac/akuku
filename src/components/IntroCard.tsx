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
    <div className=" max-w-[500] grid gap-4 grid-cols-2 pt-5 pb-5">
     
     <Button
        text="Test"
        backgroundColor="bg-emerald-800 hover:bg-emerald-900 py-8"
        textColor="text-white"
        textSize="text-2xl"
        onClick={() => {
          setStatus("active");
          setMode("test");
          console.log(mode);
          startTimer()
        }}
      />


      <Button
        text="Learn"
        backgroundColor="bg-amber-400 hover:bg-emerald-900 py-8"
        textColor="text-white"
        textSize="text-2xl"
        onClick={() => {
          setMode("learn");
          console.log(mode);
          setStatus("active");
          startTimer()
        }}
      />


      
    </div>
  );
};

export default IntroCard;
