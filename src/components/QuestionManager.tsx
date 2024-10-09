"use client"; // Client-side rendering for hooks

import React, { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard";
import FinalScore from "./FinalScore";
import Progress from "./Progress";

// Define the structure of a question
type Question = {
  pytanie: string; // The question text
  odpowiedz: string; // The correct answer
  wrongAttempts: number; // Count of incorrect answers
  goodAttempts: number; // Count of correct answers
};

interface QuestionManagerProps {
  questions: Question[]; // Array of questions passed from parent component
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ questions }) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [noRepeat, setNoRepeat] = useState<boolean>(false); // Flag for "No Repeat" checkbox

  // Create a ref for the input element
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize the questions and active set on component mount
  useEffect(() => {
    const initializedQuestions = questions.map((q) => ({
      ...q,
      wrongAttempts: 0,
      goodAttempts: 0,
    }));

    setAllQuestions(initializedQuestions);
    setActiveQuestions(getRandomQuestions(initializedQuestions, 4));
    setCurrentQuestion(initializedQuestions[0]);
  }, [questions]);

  // Function to get random questions from a pool
  const getRandomQuestions = (
    questionPool: Question[],
    count: number
  ): Question[] => {
    const shuffled = questionPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questionPool.length)); // Limit to the specified count
  };

  // Handle checking the answer
  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    const correctAnswer = currentQuestion.odpowiedz.trim().toLowerCase();
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer;

    // Increment the wrongAttempts if the answer is incorrect
    const updatedQuestion = {
      ...currentQuestion,
      wrongAttempts: isAnswerCorrect
        ? currentQuestion.wrongAttempts
        : currentQuestion.wrongAttempts + 1,
      goodAttempts: isAnswerCorrect
        ? currentQuestion.goodAttempts + 1
        : currentQuestion.goodAttempts,
    };

    const updatedQuestions = allQuestions.map((q) =>
      q.pytanie === currentQuestion.pytanie ? updatedQuestion : q
    );

    // Update all questions state
    setAllQuestions(updatedQuestions);

    // Handle new question selection based on checkbox
    if (isAnswerCorrect) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      // Handle question repetition logic
      if (noRepeat) {
        // If noRepeat is checked, find a question with goodAttempts === 0 and wrongAttempts === 0
        const nextQuestion = updatedQuestions.find(
          (q) => q.goodAttempts === 0 && q.wrongAttempts === 0
        );
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
        } else {
          setCurrentQuestion(null); // No more questions available
        }
      } else {
        // If noRepeat is unchecked, pick another question with goodAttempts === 0
        const nextQuestion = updatedQuestions.find((q) => q.goodAttempts === 0);
        setCurrentQuestion(nextQuestion || null);
      }
    }

    // Reset user input
    setUserAnswer("");

    // Focus the input after moving to the next question
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Calculate total errors across all questions
  const totalErrors = allQuestions.reduce(
    (sum, question) => sum + question.wrongAttempts,
    0
  );

  // Check if the quiz is finished
  const guessedQuestions = allQuestions.filter(
    (q) => q.goodAttempts > 0
  ).length;
  const isQuizFinished = noRepeat
    ? allQuestions.length === guessedQuestions + totalErrors
    : guessedQuestions === allQuestions.length;

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <Progress
        totalQuestions={questions.length + totalErrors} // Dynamic based on errors
        guessedCount={guessedQuestions}
        incorrectCount={totalErrors} // Pass total errors as incorrect count
      />

      {!isQuizFinished ? (
        <>
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
            <p
              className={`mt-2 ${
                isCorrect ? "text-green-300" : "text-red-300"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect. Try again!"}
            </p>
          )}
          <label className="mt-4">
            <input
              type="checkbox"
              checked={noRepeat}
              onChange={() => setNoRepeat((prev) => !prev)}
              className="mr-2"
            />
            No Repeat
          </label>
        </>
      ) : (
        <FinalScore
          correctCount={guessedQuestions}
          totalCount={questions.length}
        />
      )}

      <ul className="mt-4">
        {allQuestions.map((q, index) => (
          <li
            key={index}
            className={`p-2 ${
              q.goodAttempts > 0
                ? "bg-green-300"
                : q.wrongAttempts > 0
                ? "bg-red-300"
                : "bg-white"
            }`}
          >
            {q.pytanie}
            {q.goodAttempts > 0 && (
              <span className="text-green-500 ml-2">(Guessed)</span>
            )}
            {q.wrongAttempts > 0 && (
              <span className="text-red-500 ml-2">
                (Wrong Attempts: {q.wrongAttempts})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionManager;
