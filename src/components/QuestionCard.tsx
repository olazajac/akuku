import React from "react";

interface QuestionCardProps {
  question: string;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  onCheckAnswer: (event?: React.MouseEvent | React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isCorrect: boolean | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  onCheckAnswer,
  inputRef,
  isCorrect,
}) => {
  return (
    <div className="mb-4 p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold">{question}</h2>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onCheckAnswer(e)}
        ref={inputRef}
        className="mt-2 p-2 border rounded w-full"
        placeholder="Type your answer"
      />
      <button
        onClick={onCheckAnswer}
        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
      {isCorrect !== null && (
        <p
          className={`mt-2 text-lg ${
            isCorrect ? "text-green-500" : "text-red-500"
          }`}
        >
          {isCorrect ? "Correct!" : "Wrong answer, try again!"}
        </p>
      )}
    </div>
  );
};

export default QuestionCard;
