import React from "react";

interface FinalScoreProps {
  totalQuestions: number;
  guessedCount: number;
  incorrectCount: number;
  totalTime: number;
}

const FinalScore: React.FC<FinalScoreProps> = ({
  guessedCount,
  totalQuestions,
  incorrectCount,
  totalTime,
}) => {
  return (
    <div className="fixed inset-0 bg-blue-200 flex flex-col justify-center align-center text-center">
      <h2 className="text-2xl font-bold mb-4">{((guessedCount * 100) / (incorrectCount + guessedCount)).toFixed(0)}%</h2>
      <p className="text-xl">
        Your time:
      </p>
      <p className="text-xl">
        {totalTime}
      </p>
    </div>
  );
};

export default FinalScore;
