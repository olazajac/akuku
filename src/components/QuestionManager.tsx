"use client";

import React, { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard";
import FinalScore from "./FinalScore";
import Progress from "./Progress";

// Define the structure of a question
type Question = {
  pytanie: string;
  odpowiedz: string;
};

const QuestionManager: React.FC<{ questions: Question[] }> = ({
  questions,
}) => {
  const [inactiveQuestions, setInactiveQuestions] = useState<Question[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [guessedQuestions, setGuessedQuestions] = useState<Question[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<Question[]>([]);
  const [incorrectCounts, setIncorrectCounts] = useState<{
    [key: string]: number;
  }>({});
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<Question | null>(
    null
  );
  const [noRepeat, setNoRepeat] = useState<boolean>(false);

  // Create a ref for the input element
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize inactiveQuestions with all questions at the start
  useEffect(() => {
    const initialInactiveQuestions = [...questions];
    const initialActiveQuestions = getRandomQuestions(
      initialInactiveQuestions,
      4
    );
    setInactiveQuestions(
      initialInactiveQuestions.filter(
        (q) => !initialActiveQuestions.includes(q)
      )
    );
    setActiveQuestions(initialActiveQuestions);
    setCurrentQuestion(initialActiveQuestions[0]);
  }, [questions]);

  // Function to get random questions from a pool
  const getRandomQuestions = (
    questionPool: Question[],
    count: number
  ): Question[] => {
    const shuffled = questionPool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questionPool.length));
  };

  // Handle checking the answer
  const handleCheckAnswer = () => {
    if (!currentQuestion) return;

    const correctAnswer = currentQuestion.odpowiedz.trim().toLowerCase();
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer;

    if (isAnswerCorrect) {
      setIsCorrect(true);
      setGuessedQuestions((prev) => [...prev, currentQuestion]); // Track correct answers

      // Update active questions
      const updatedActiveQuestions = activeQuestions.filter(
        (q) => q.pytanie !== currentQuestion.pytanie
      );

      // Add new question from inactive if available
      if (inactiveQuestions.length > 0) {
        const newQuestion = getRandomQuestions(inactiveQuestions, 1)[0];
        updatedActiveQuestions.push(newQuestion);
        setInactiveQuestions((prev) => prev.filter((q) => q !== newQuestion));
      }

      // Update active questions if total is less than or equal to 4
      if (inactiveQuestions.length + updatedActiveQuestions.length <= 4) {
        setActiveQuestions([...updatedActiveQuestions, ...inactiveQuestions]);
        setInactiveQuestions([]);
      } else {
        setActiveQuestions(updatedActiveQuestions);
      }
    } else {
      setIsCorrect(false);
      setIncorrectCounts((prev) => ({
        ...prev,
        [currentQuestion.pytanie]: (prev[currentQuestion.pytanie] || 0) + 1,
      }));

      // Handle no repeat logic
      if (noRepeat) {
        setIncorrectQuestions((prev) => [...prev, currentQuestion]);
        setActiveQuestions((prev) =>
          prev.filter((q) => q.pytanie !== currentQuestion.pytanie)
        );

        if (inactiveQuestions.length > 0) {
          const newQuestion = getRandomQuestions(inactiveQuestions, 1)[0];
          setActiveQuestions((prev) => [...prev, newQuestion]);
          setInactiveQuestions((prev) => prev.filter((q) => q !== newQuestion));
        }
      }
    }

    // Set the next question
    let nextQuestion;
    do {
      nextQuestion =
        activeQuestions[Math.floor(Math.random() * activeQuestions.length)];
    } while (nextQuestion === lastAskedQuestion && activeQuestions.length > 1);

    setCurrentQuestion(nextQuestion);
    setLastAskedQuestion(nextQuestion);
    setUserAnswer("");

    // Focus the input after moving to the next question
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const isQuizFinished =
    activeQuestions.length === 0 && inactiveQuestions.length === 0;

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <Progress
        totalQuestions={questions.length}
        guessedCount={guessedQuestions.length} // Count only correct answers
        incorrectCount={Object.values(incorrectCounts).reduce(
          (sum, count) => sum + count,
          0
        )}
      />

      {!isQuizFinished ? (
        <>
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion.pytanie}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onCheckAnswer={handleCheckAnswer}
              inputRef={inputRef} // Pass the inputRef to QuestionCard
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
          correctCount={guessedQuestions.length}
          totalCount={questions.length}
          incorrectCount={Object.values(incorrectCounts).reduce(
            (sum, count) => sum + count,
            0
          )} // Pass incorrectCount
        />
      )}

      <ul className="mt-4">
        {questions.map((q, index) => (
          <li
            key={index}
            className={`p-2 ${
              guessedQuestions.includes(q)
                ? "bg-green-300"
                : incorrectQuestions.includes(q)
                ? "bg-red-300"
                : activeQuestions.includes(q)
                ? "border border-blue-400"
                : "bg-white"
            }`}
          >
            {q.pytanie}
            {incorrectCounts[q.pytanie] > 0 && (
              <span className="text-red-500 ml-2">
                (Wrong Attempts: {incorrectCounts[q.pytanie]})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionManager;
