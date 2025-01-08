import React from "react";

interface FinalScoreProps {
  totalQuestions: number;
  guessedCount: number;
  incorrectCount: number;
  minutes: number;
  seconds: number;
  perfectCount: number;
}

const FinalScore: React.FC<FinalScoreProps> = ({
  guessedCount,
  totalQuestions,
  incorrectCount,
  minutes,
  seconds,
  perfectCount
}) => {
  return (
    <div className="flex flex-col  gap-[30px] items-center mt-[170px]">
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl">
        You answered {guessedCount} questions and made {incorrectCount} errors.</p>

        <p className="text-xl">
        Your score is:
        {((guessedCount * 100) / (incorrectCount + guessedCount)).toFixed(0)}%. </p>

        <p className="text-xl">
        Total unique questions: {totalQuestions}</p>

        <p className="text-xl">
        Total questions answeared at first try: {perfectCount} </p>

        <p className="text-xl">
        
        Your time: {(minutes ?? 0).toString().padStart(2, "0")}:{(seconds ?? 0).toString().padStart(2, "0")}</p>
      
    </div>
  );
};

export default FinalScore;
