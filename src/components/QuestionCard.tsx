import React from "react";

const QuestionCard: React.FC<{
  question: string;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  onCheckAnswer: () => void;
  inputRef: React.RefObject<HTMLInputElement>; // Accept the inputRef prop
}> = ({ question, userAnswer, setUserAnswer, onCheckAnswer, inputRef }) => {
  return (
    <div className="border p-4 rounded-md shadow-md">
      <h2 className="text-xl mb-4">{question}</h2>
      <input
        ref={inputRef} // Attach the inputRef to the input element
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="border rounded p-2 w-full"
        placeholder="Type your answer here"
      />
      <button
        onClick={onCheckAnswer}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Check Answer
      </button>
    </div>
  );
};

export default QuestionCard;
