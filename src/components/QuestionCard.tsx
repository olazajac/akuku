// src/components/QuestionCard.tsx
import React from "react";

interface QuestionCardProps {
  question: string;
  answer: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answer }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md w-80 mx-auto">
      <p className="font-bold">{question}</p>
      <p className="text-gray-700">{answer}</p>
    </div>
  );
};

export default QuestionCard;
