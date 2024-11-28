// src/components/Progress.tsx
import React from "react";

interface ProgressProps {
  totalQuestions: number;
  guessedCount: number;
  incorrectCount: number;
  isRepeatChecked: boolean;
}

const Progress: React.FC<ProgressProps> = ({
  totalQuestions,
  guessedCount,
  incorrectCount,
  isRepeatChecked,
}) => {
  const totalAnswered = guessedCount;
  const progressPercentage = (totalAnswered / totalQuestions) * 100;
  const questionsLeft = !isRepeatChecked ? totalQuestions - totalAnswered : totalQuestions - totalAnswered -incorrectCount ;

  return (
    <div className="w-full p-4 ">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm "> {questionsLeft} / {totalQuestions}</p>
        <p className="text-sm ">{guessedCount}</p>
        <p className="text-sm ">Errors: {incorrectCount}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {/* <p className="text-center text-sm font-semibold">
        {progressPercentage.toFixed(0)}% completed
      </p> */}
    </div>
  );
};

export default Progress;
