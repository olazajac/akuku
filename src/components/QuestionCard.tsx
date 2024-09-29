// src/components/QuestionCard.tsx
import React from "react";

const QuestionCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 w-80 shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <p className="mb-4 text-lg font-bold">Your Question Here:</p>
      <input
        type="text"
        placeholder="Type your answer..."
        className="p-2 mb-4 border border-gray-300 rounded w-full"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </div>
  );
};

export default QuestionCard;
