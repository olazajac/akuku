"use client"; // Client-side rendering for hooks

import React, { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard";
import Progress from "./Progress";

// Define the structure of an extended question
type Question = {
  pytanie: string;
  odpowiedz: string;
  guessed: number; // 0 if not guessed, 1 if guessed
  errors: number; // Count of incorrect answers
  active: number; // 1 if the question is currently active, 0 otherwise
  IsCurrent: number; // 1 if the question is the current one, 0 otherwise
};

interface QuestionManagerProps {
  questions: ExtendedQuestion[]; // Expect the extended version of the question
  setActiveQuestions: React.Dispatch<React.SetStateAction<ExtendedQuestion[]>>;
  activeQuestions: ExtendedQuestion[];
}
const QuestionManager: React.FC<QuestionManagerProps> = ({
  questions,
  setActiveQuestions,
  activeQuestions,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [totalErrors, setTotalErrors] = useState<number>(0); // Total errors count

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[0]); // Set the first question as the current question
    }
  }, [questions]);

  // Function to check the user's answer
  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    const correctAnswer = currentQuestion.odpowiedz.trim().toLowerCase();
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer;

    if (isAnswerCorrect) {
      setIsCorrect(true);

      const updatedQuestion = { ...currentQuestion, guessed: 1, active: 0, IsCurrent: 0 };
      const updatedQuestions = questions.map((q) =>
        q.pytanie === currentQuestion.pytanie ? updatedQuestion : q
      );

      setActiveQuestions(updatedQuestions.filter((q) => q.active === 1));
    } else {
      setIsCorrect(false);
      setTotalErrors((prev) => prev + 1);
    }

    setUserAnswer(""); // Reset the input field
    inputRef.current?.focus(); // Focus the input field again
  };

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="flex justify-between w-full px-4">
        <Progress totalQuestions={questions.length} guessedCount={activeQuestions.filter(q => q.guessed === 1).length} incorrectCount={totalErrors} />
        <div className="text-right">
          <p>Total Errors: {totalErrors}</p>
        </div>
      </div>

      {currentQuestion && (
        <QuestionCard
          question={currentQuestion.pytanie}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          onCheckAnswer={handleCheckAnswer}
          inputRef={inputRef}
        />
      )}

      {isCorrect !== null && (
        <p className={`mt-2 ${isCorrect ? "text-green-300" : "text-red-300"}`}>
          {isCorrect ? "Correct!" : "Incorrect. Try again!"}
        </p>
      )}

      <ul className="mt-4">
        {questions.map((q, index) => (
          <li key={index} className={`p-2 ${q.guessed === 1 ? "bg-green-300" : q.errors > 0 ? "bg-red-300" : q.active === 1 ? "border border-blue-400" : "bg-white"}`}>
            {q.pytanie}
            {q.guessed === 1 && <span className="text-green-500 ml-2">(Guessed)</span>}
            {q.errors > 0 && <span className="text-red-500 ml-2">(Wrong Attempts: {q.errors})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionManager;