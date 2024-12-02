// src/components/Progress.tsx
import React from "react";

interface ProgressProps {
  totalQuestions: number;
  guessedCount: number;
  incorrectCount: number;
  isRepeatChecked: boolean;
  minutes: number;
  seconds: number;
}

const Progress: React.FC<ProgressProps> = ({
  totalQuestions,
  guessedCount,
  incorrectCount,
  isRepeatChecked,
  minutes,
  seconds,
}) => {
  const totalAnswered = guessedCount;
  const progressPercentage =!isRepeatChecked ? (totalAnswered / totalQuestions) * 100 : ((totalAnswered+incorrectCount) / totalQuestions) * 100 ;
  const questionsLeft = !isRepeatChecked ? totalQuestions - totalAnswered : totalQuestions - totalAnswered -incorrectCount ;

  return (
    <div className="w-full p-1 ">
        <div className="w-full bg-emerald-800 rounded-full h-1 mb-4">
        <div
          className="bg-emerald-500 h-1 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between mb-0">
        <p className="text-sm "> {questionsLeft} / {totalQuestions}</p>

        <div className="timer">
        <p className="text-xs w-[100px] text-center text-emerald-500 bg-emerald-800 rounded-lg px-2 py-1" > {minutes}:{seconds}</p>
      </div>

      <div>  <p className="text-sm ">{guessedCount} - <span>{incorrectCount}</span></p>
      </div>
       

       
      </div>
    
      {/* <p className="text-center text-sm font-semibold">
        {progressPercentage.toFixed(0)}% completed
      </p> */}
    </div>
  );
};

export default Progress;
