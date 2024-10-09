import React from "react";

interface ProgressProps {
  totalQuestions: number;
  guessedCount: number;
  incorrectCount: number;
  totalErrors: number; // Added totalErrors prop
}

const Progress: React.FC<ProgressProps> = ({
  totalQuestions,
  guessedCount,
  incorrectCount,
  totalErrors,
}) => {
  const totalAnswered = guessedCount; // Only track correct answers for progress
  const progressPercentage = (totalAnswered / totalQuestions) * 100;
  const questionsLeft = totalQuestions - totalAnswered;

  return (
    <div className="w-full p-4 bg-gray-100 shadow-md rounded-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold">Questions Left: {questionsLeft}</p>
        <p className="text-sm font-semibold">Correct Answers: {guessedCount}</p>
        <p className="text-sm font-semibold">
          Total Errors: {totalErrors}
        </p>{" "}
        {/* Display total errors */}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-center text-sm font-semibold">
        {progressPercentage.toFixed(0)}% completed
      </p>
    </div>
  );
};

export default Progress;
