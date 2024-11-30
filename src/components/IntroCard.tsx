import React from "react";
import Button from "./Button";

interface IntroCardProps {
  mode: string;
  setMode: (mode: string) => void;
  setStatus: (status: string) => void;
  startTimer: () => void;
  totalQuestions: number;
}

const IntroCard: React.FC<IntroCardProps> = ({
  setMode,
  setStatus,
  mode,
  startTimer,
  totalQuestions,

}) => {
  return (
    <div className=" max-w-full flex flex-col items-center pt-5 pb-5 text-white">
       <h2 className="text-6xl p-3">{totalQuestions}</h2>
       <h1 className="text-xl p-2">Unit 3</h1>
     
     <div className="flex flex-row gap-3">     <Button
        text="Test"
        backgroundColor="bg-emerald-800 hover:bg-emerald-900 p-8 w-full"
        textColor="text-white"
        textSize="text-xl"
        onClick={() => {
          setStatus("active");
          setMode("test");
          console.log(mode);
          startTimer()
        }}
      />


      <Button
        text="Learn"
        backgroundColor="bg-amber-400 hover:bg-emerald-900 p-8 w-full"
        textColor="text-white"
        textSize="text-xl"
        onClick={() => {
          setMode("learn");
          console.log(mode);
          setStatus("active");
          startTimer()
        }}
      /></div>



      
    </div>
  );
};

export default IntroCard;
