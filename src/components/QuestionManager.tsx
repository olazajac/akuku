"use client";

import React, { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import FinalScore from "./FinalScore";
import Progress from "./Progress"; // Import the Progress component

const QuestionManager: React.FC<{ questions: any[] }> = ({ questions }) => {
  const [inactiveQuestions, setInactiveQuestions] = useState<any[]>([]);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [guessedQuestions, setGuessedQuestions] = useState<any[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<any[]>([]);
  const [incorrectCounts, setIncorrectCounts] = useState<{
    [key: string]: number;
  }>({});
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [lastAskedQuestion, setLastAskedQuestion] = useState<any | null>(null);
  const [noRepeat, setNoRepeat] = useState(false); // No-repeat state

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
    setCurrentQuestion(initialActiveQuestions[0]); // Set the first question from active
  }, [questions]);

  // Function to get random questions from a pool
  const getRandomQuestions = (questionPool: any[], count: number) => {
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
      setGuessedQuestions((prev) => [...prev, currentQuestion]);

      // Remove the correctly answered question from activeQuestions
      let updatedActiveQuestions = activeQuestions.filter(
        (q) => q.pytanie !== currentQuestion.pytanie
      );

      // If there are inactive questions, add one to active
      if (inactiveQuestions.length > 0) {
        const newQuestion = getRandomQuestions(inactiveQuestions, 1)[0];
        updatedActiveQuestions.push(newQuestion);
        setInactiveQuestions((prev) => prev.filter((q) => q !== newQuestion));
      }

      setActiveQuestions(updatedActiveQuestions);

      // If no questions are left in inactive and active is less than 4, move remaining inactive to active
      if (inactiveQuestions.length + updatedActiveQuestions.length <= 4) {
        setActiveQuestions([...updatedActiveQuestions, ...inactiveQuestions]);
        setInactiveQuestions([]);
      }
    } else {
      setIsCorrect(false);

      // Update the incorrect count for the current question
      setIncorrectCounts((prev) => ({
        ...prev,
        [currentQuestion.pytanie]: (prev[currentQuestion.pytanie] || 0) + 1,
      }));

      // If no-repeat is checked, move the question to the incorrect list and pick another
      if (noRepeat) {
        setIncorrectQuestions((prev) => [...prev, currentQuestion]);

        // Remove incorrect question from activeQuestions when no-repeat is enabled
        setActiveQuestions((prev) =>
          prev.filter((q) => q.pytanie !== currentQuestion.pytanie)
        );

        // Pick a new question from inactive to maintain the active list at 4
        if (inactiveQuestions.length > 0) {
          const newQuestion = getRandomQuestions(inactiveQuestions, 1)[0];
          setActiveQuestions((prev) => [...prev, newQuestion]);
          setInactiveQuestions((prev) => prev.filter((q) => q !== newQuestion));
        }
      }
    }

    // Pick a new random current question from active questions
    let nextQuestion;
    do {
      nextQuestion =
        activeQuestions[Math.floor(Math.random() * activeQuestions.length)];
    } while (nextQuestion === lastAskedQuestion && activeQuestions.length > 1);

    setCurrentQuestion(nextQuestion);
    setLastAskedQuestion(nextQuestion);
    setUserAnswer(""); // Clear the user answer
  };

  // Check if the quiz is finished (no more active or inactive questions)
  const isQuizFinished =
    activeQuestions.length === 0 && inactiveQuestions.length === 0;

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      {/* Progress bar component */}
      <Progress
        totalQuestions={questions.length}
        guessedCount={guessedQuestions.length}
        incorrectCount={Object.values(incorrectCounts).reduce(
          (sum, count) => sum + count,
          0
        )} // Total errors
      />

      {!isQuizFinished ? (
        <>
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion.pytanie}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              onCheckAnswer={handleCheckAnswer}
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
