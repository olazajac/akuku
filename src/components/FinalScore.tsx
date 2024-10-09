// src/components/FinalScore.tsx
import React from "react";

interface FinalScoreProps {
  correctCount: number;
  totalCount: number;
}

const FinalScore: React.FC<FinalScoreProps> = ({
  correctCount,
  totalCount,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl">
        You answered {correctCount} out of {totalCount} questions correctly.
      </p>
    </div>
  );
};

export default FinalScore;
