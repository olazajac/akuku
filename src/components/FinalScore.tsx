import React from "react";

interface FinalScoreProps {
  correctCount: number; // Good Answers
  totalCount: number; // Total Questions
  incorrectCount: number; // Errors
}

const FinalScore: React.FC<FinalScoreProps> = ({
  correctCount,
  totalCount,
  incorrectCount,
}) => {
  // Calculate the total answered questions
  const totalAnswered = correctCount + incorrectCount;

  // Calculate the grade percentage
  const gradePercentage =
    totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl">
        Good answers: {correctCount} out of {totalCount}
      </p>
      <p className="text-lg text-red-500">Errors: {incorrectCount}</p>
      <p className="text-xl">Your percentage: {gradePercentage.toFixed(2)}%</p>
    </div>
  );
};

export default FinalScore;
