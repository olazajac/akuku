// src/components/QuestionCard.tsx

import React from "react";

interface QuestionCardProps {
  question: string; // The question text
  userAnswer: string; // The user's answer
  setUserAnswer: (answer: string) => void; // Function to update the answer
  onCheckAnswer: () => void; // Function to check the answer
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  onCheckAnswer,
}) => {
  // Function to handle key down events
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission if inside a form
      onCheckAnswer(); // Check the answer
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{question}</h2>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={handleKeyDown} // Attach the key down event
        className="border border-gray-300 rounded-md p-2 w-full text-black"
        placeholder="Type your answer here..."
      />
      <button
        onClick={onCheckAnswer}
        className="mt-2 bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition duration-300"
      >
        Check Answer
      </button>
    </div>
  );
};

export default QuestionCard;
