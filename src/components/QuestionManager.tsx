import React, { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard"; // Assuming this is implemented correctly
import FinalScore from "./FinalScore"; // Assuming this is implemented correctly
import Progress from "./Progress"; // Assuming this is implemented correctly

type Question = {
  pytanie: string; // The question text
  odpowiedz: string; // The correct answer
  hot: number; // Hot status
  guessed: number; // Guessed status
  errors: number; // Error count
  index: number; // Unique index
};

const QuestionManager: React.FC<{
  questions: { pytanie: string; odpowiedz: string }[];
}> = ({ questions }) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [previousQuestion, setPreviousQuestion] = useState<Question | null>(
    null
  ); // Track previous question
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isRepeatChecked, setIsRepeatChecked] = useState<boolean>(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // Initialize questions
    const initializedQuestions = questions.map((q, index) => ({
      pytanie: q.pytanie,
      odpowiedz: q.odpowiedz,
      hot: 0, // Changed from active to hot
      guessed: 0,
      errors: 0,
      index: index,
    }));

    setAllQuestions(initializedQuestions);

    // Shuffle questions
    const shuffled = shuffleArray(initializedQuestions);
    setShuffledQuestions(shuffled);

    // Set the first 4 questions as hot
    const initialHotQuestions = shuffled.slice(0, 4);
    setShuffledQuestions((prev) =>
      prev.map((q) => (initialHotQuestions.includes(q) ? { ...q, hot: 1 } : q))
    );

    // Set the current question to the first hot question
    setCurrentQuestion(initialHotQuestions[0]);
    setPreviousQuestion(null); // Initialize previous question as null

    // Focus the input after loading
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [questions]);

  const shuffleArray = (array: Question[]): Question[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const getTotalErrorCount = () => {
    return shuffledQuestions.reduce((sum, q) => sum + q.errors, 0);
  };

  const handleCheckAnswer = (
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    // Handle submission only on Enter key or button click
    if (
      event &&
      event.type === "keydown" &&
      (event as React.KeyboardEvent).key !== "Enter"
    ) {
      return;
    }

    if (!currentQuestion || userAnswer.trim() === "") return;

    // Ensure correct answer is trimmed and lowercased
    const correctAnswer = currentQuestion.odpowiedz.trim().toLowerCase();
    const userAnswerTrimmed = userAnswer.trim().toLowerCase();

    // Check if the answer is correct
    const isAnswerCorrect = userAnswerTrimmed === correctAnswer;

    if (isAnswerCorrect) {
      setIsCorrect(true);
      // Move the question to guessed state
      updateQuestionStatus(currentQuestion.index, { guessed: 1, hot: 0 }); // Changed from active to hot
      // Reset user answer
      setUserAnswer("");
      NewHotQuestion(); // Changed from NewActiveQuestion to NewHotQuestion
    } else {
      setIsCorrect(false);
      // Increment error count
      updateQuestionStatus(currentQuestion.index, {
        errors: currentQuestion.errors + 1,
        // Mark current question as not hot
      });

      if (isRepeatChecked) {
        // If checkbox is checked, we consider it an error question
        updateQuestionStatus(currentQuestion.index, {
          hot: 0, // Mark current question as not hot
        });

        NewHotQuestion(); // Changed from NewActiveQuestion to NewHotQuestion
      }
    }

    // Reset user answer
    setUserAnswer("");

    // Clear input and refocus
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input after processing the answer
    }

    NewCurrentQuestion();
  };

  const updateQuestionStatus = (index: number, updates: Partial<Question>) => {
    setShuffledQuestions((prev) =>
      prev.map((q) => (q.index === index ? { ...q, ...updates } : q))
    );
  };

  const getFilteredAvailableQuestions = () => {
    // Filter based on hot status - we can get current question from these
    return shuffledQuestions.filter((q) => q.hot === 1 && q.guessed === 0);
  };

  const availableQuestions = getFilteredAvailableQuestions();

  const NewHotQuestion = () => {
    let nextHotQuestion = shuffledQuestions.find(
      (q) => q.hot === 0 && q.guessed === 0
    );

    // If we find a question, we mark it as hot.
    if (nextHotQuestion) {
      updateQuestionStatus(nextHotQuestion.index, { hot: 1 });
    }
  };

  const NewCurrentQuestion = () => {
    // Filter the available questions (hot and not guessed)
    const availableQuestions = shuffledQuestions.filter(
      (q) => q.hot === 1 && q.index !== currentQuestion?.index
    );

    // Randomly select one of the available questions
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const nextQuestion = availableQuestions[randomIndex];

      setCurrentQuestion(nextQuestion);
    }
  };

  const getFilteredGuessedQuestions = () => {
    return shuffledQuestions.filter((q) => q.guessed === 1);
  };

  const getFilteredErrorQuestions = () => {
    return shuffledQuestions.filter((q) => q.errors > 0);
  };

  const isQuizFinished =
    allQuestions.length === getFilteredGuessedQuestions().length;

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <Progress
        totalQuestions={allQuestions.length}
        guessedCount={getFilteredGuessedQuestions().length}
        incorrectCount={getTotalErrorCount()} // Pass the sum of all errors
      />

      {!isQuizFinished && currentQuestion && (
        <QuestionCard
          question={currentQuestion.pytanie}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          onCheckAnswer={handleCheckAnswer}
          inputRef={inputRef}
          isCorrect={isCorrect}
        />
      )}

      {/* Display the lists of questions using filtered results */}
      <div className="mt-4">
        <h3>Hot Questions:</h3>
        <ul className="flex flex-wrap mt-2 gap-4">
          {shuffledQuestions
            .filter((q) => q.hot === 1)
            .map((q) => (
              <li
                key={q.index}
                className="p-2 w-48 border border-blue-400 bg-white"
              >
                {q.pytanie}
                <div className="text-sm text-gray-600 mt-1">
                  <p>Hot: {q.hot}</p>
                  <p>Guessed: {q.guessed}</p>
                  <p>Errors: {q.errors}</p>
                  <p>ID: {q.index}</p>
                </div>
              </li>
            ))}
        </ul>

        <h3>Guessed Questions:</h3>
        <ul className="flex flex-wrap mt-2 gap-4">
          {getFilteredGuessedQuestions().map((q) => (
            <li key={q.index} className="p-2 w-48 bg-green-300">
              {q.pytanie}
              <div className="text-sm text-gray-600 mt-1">
                <p>Hot: {q.hot}</p>
                <p>Guessed: {q.guessed}</p>
                <p>Errors: {q.errors}</p>
                <p>ID: {q.index}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3>Error Questions:</h3>
        <ul className="flex flex-wrap mt-2 gap-4">
          {getFilteredErrorQuestions().map((q) => (
            <li key={q.index} className="p-2 w-48 bg-red-300">
              {q.pytanie}
              <div className="text-sm text-gray-600 mt-1">
                <p>Hot: {q.hot}</p>
                <p>Guessed: {q.guessed}</p>
                <p>Errors: {q.errors}</p>
                <p>ID: {q.index}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3>Rest Questions:</h3>
        <ul className="flex flex-wrap mt-2 gap-4">
          {shuffledQuestions
            .filter((q) => q.hot === 0 && q.guessed === 0)
            .map((q) => (
              <li
                key={q.index}
                className="p-2 w-48 border border-blue-200 bg-white"
              >
                {q.pytanie}
                <div className="text-sm text-gray-600 mt-1">
                  <p>Hot: {q.hot}</p>
                  <p>Guessed: {q.guessed}</p>
                  <p>Errors: {q.errors}</p>
                  <p>ID: {q.index}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {isQuizFinished && (
        <FinalScore
          totalQuestions={allQuestions.length}
          guessedCount={getFilteredGuessedQuestions().length}
          incorrectCount={getTotalErrorCount()}
        />
      )}
    </div>
  );
};

export default QuestionManager;
