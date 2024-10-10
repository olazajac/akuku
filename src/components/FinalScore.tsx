import React from "react";

interface FinalScoreProps {
  totalQuestions: number;
  guessedCount: number;
  incorrectCount: number;
}

const FinalScore: React.FC<FinalScoreProps> = ({
  guessedCount,
  totalQuestions,
  incorrectCount,
}) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl">
        You answered {guessedCount} questions and made {incorrectCount} errors.
        Your score is:{" "}
        {((guessedCount * 100) / (incorrectCount + guessedCount)).toFixed(0)}
        %. Total unique questions: {totalQuestions}
      </p>
    </div>
  );
};

export default FinalScore;
