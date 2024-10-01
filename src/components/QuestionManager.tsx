"use client"; // Client-side rendering for hooks

import React, { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard";
import FinalScore from "./FinalScore";
import Progress from "./Progress";

// Define the structure of a question
type Question = {
  pytanie: string; // The question text
  odpowiedz: string; // The correct answer
  guessed: number; // 0 if not guessed, 1 if guessed
  errors: number; // Count of incorrect answers
  active: number; // 1 if the question is currently active, 0 otherwise
  IsCurrent: number; // 1 if the question is the current one, 0 otherwise
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
  const [totalErrors, setTotalErrors] = useState<number>(0); // Total errors count

  // Create a ref for the input element
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize the questions and active set on component mount
  useEffect(() => {
    const initializedQuestions = questions.map((q) => ({
      ...q,
      guessed: 0,
      errors: 0,
      active: 0,
      IsCurrent: 0,
    }));

    const initialActiveQuestions = getRandomQuestions(initializedQuestions, 4);
    const firstActiveQuestion = initialActiveQuestions[0];
    
    setAllQuestions(
      initializedQuestions.map((q) => ({
        ...q,
        active: initialActiveQuestions.includes(q) ? 1 : 0,
        IsCurrent: q === firstActiveQuestion ? 1 : 0,
      }))
    );
    
    setActiveQuestions(initialActiveQuestions);
    setCurrentQuestion(firstActiveQuestion);
  }, [questions]);

  // Function to get random questions from a pool
  const getRandomQuestions = (questionPool: Question[], count: number): Question[] => {
    const shuffled = questionPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questionPool.length)); // Limit to the specified count
  };

  // Handle checking the answer on Enter
  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    const correctAnswer = currentQuestion.odpowiedz.trim().toLowerCase();
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer;
    
    let updatedActiveQuestions = [...activeQuestions];
    let totalErrorsAcc = totalErrors;

    if (isAnswerCorrect) {
      // Correct answer logic
      setIsCorrect(true);

      const updatedQuestion = { ...currentQuestion, guessed: 1, active: 0, IsCurrent: 0 };
      const updatedQuestions = allQuestions.map((q) =>
        q.pytanie === currentQuestion.pytanie ? updatedQuestion : q
      );

      updatedActiveQuestions = updatedActiveQuestions.filter((q) => q.pytanie !== currentQuestion.pytanie);
      
      // If repeat is off (noRepeat is false), activate new question if available
      const newActiveQuestion = noRepeat
        ? getNextQuestion(updatedQuestions, false, true)
        : getNextQuestion(updatedQuestions, true, false);
      
      if (newActiveQuestion) {
        updatedActiveQuestions = [...updatedActiveQuestions, newActiveQuestion];
      }

      setAllQuestions(updatedQuestions);
      setActiveQuestions(updatedActiveQuestions);
    } else {
      // Wrong answer logic
      setIsCorrect(false);
      
      const updatedQuestion = { 
        ...currentQuestion, 
        errors: currentQuestion.errors + 1, 
        active: noRepeat ? 0 : 1, // Deactivate if no repeat is on
        IsCurrent: 0
      };

      const updatedQuestions = allQuestions.map((q) =>
        q.pytanie === currentQuestion.pytanie ? updatedQuestion : q
      );

      totalErrorsAcc += 1;
      setTotalErrors(totalErrorsAcc);

      if (noRepeat) {
        updatedActiveQuestions = updatedActiveQuestions.filter(
          (q) => q.pytanie !== currentQuestion.pytanie
        );
      }

      const newActiveQuestion = noRepeat
        ? getNextQuestion(updatedQuestions, false, true)
        : getNextQuestion(updatedQuestions, true, false);

      if (newActiveQuestion) {
        updatedActiveQuestions = [...updatedActiveQuestions, newActiveQuestion];
      }

      setAllQuestions(updatedQuestions);
      setActiveQuestions(updatedActiveQuestions);
    }

    // Set the next current question
    if (updatedActiveQuestions.length > 0) {
      const newCurrentQuestion = updatedActiveQuestions[Math.floor(Math.random() * updatedActiveQuestions.length)];
      setCurrentQuestion(newCurrentQuestion);

      // Update `IsCurrent` for new current question
      const updatedQuestions = allQuestions.map((q) =>
        q.pytanie === newCurrentQuestion.pytanie ? { ...q, IsCurrent: 1 } : { ...q, IsCurrent: 0 }
      );
      setAllQuestions(updatedQuestions);
    } else {
      setCurrentQuestion(null); // No more active questions
    }

    setUserAnswer(""); // Reset the answer input
    inputRef.current?.focus(); // Focus on the input again
  };

  // Function to get the next question based on conditions
  const getNextQuestion = (questions: Question[], checkActive = true, checkErrors = false): Question | null => {
    const availableQuestions = questions.filter(
      (q) =>
        q.guessed === 0 &&
        (!checkActive || q.active === 1) &&
        (!checkErrors || q.errors > 0)
    );

    return availableQuestions.length > 0 ? getRandomQuestions(availableQuestions, 1)[0] : null;
  };

  // Check if the quiz is finished
  const guessedQuestions = allQuestions.filter((q) => q.guessed === 1).length;
  const erroredQuestions = allQuestions.filter((q) => q.errors > 0).length;
  const isQuizFinished = noRepeat
    ? allQuestions.length === guessedQuestions + erroredQuestions
    : allQuestions.length === guessedQuestions;

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="flex justify-between w-full px-4">
        <Progress totalQuestions={questions.length} guessedCount={guessedQuestions} incorrectCount={erroredQuestions} />
        <div className="text-right">
          <p>Total Errors: {totalErrors}</p>
        </div>
      </div>

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
            <p className={`mt-2 ${isCorrect ? "text-green-300" : "text-red-300"}`}>
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
        <FinalScore correctCount={guessedQuestions} totalCount={questions.length} />
      )}

      <ul className="mt-4">
        {allQuestions.map((q, index) => (
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
