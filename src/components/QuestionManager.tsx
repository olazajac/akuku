import React, { useState, useEffect, useRef } from "react";
import QuestionCard from "./QuestionCard"; // Assuming this is implemented correctly
import FinalScore from "./FinalScore"; // Assuming this is implemented correctly
import Progress from "./Progress"; // Assuming this is implemented correctly
import Settings from "./Settings";
import axios from "axios";
import ErrorCard from "./ErrorCard";
import CorrectCard from "./CorrectCard";
import IntroCard from "./IntroCard";
import SwipeListener from "./SwipeListener"; // Import the swipe listener component
import Timer from "./Timer"; // Import the Timer component

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

  const [userAnswer, setUserAnswer] = useState<string>("");
  const [status, setStatus] = useState<string>("intro");
  const [mode, setMode] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isRepeatChecked, setIsRepeatChecked] = useState<boolean>(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<number>(0); // Store total time taken
  const [prevquestion, setPrevquestion] = useState<string>(" ");
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (status === "active" && mode === "learn" && !isQuizFinished) {
        if (event.key === "ArrowRight") {
          handleCheckAnswer(true);
        }
        if (event.key === "ArrowLeft") {
          handleCheckAnswer(false);
        }
      }

      if (event.ctrlKey && event.key === "m") {
        console.log(
          "sdfdsafdsafffffffffffffffffffffffffffffffffffffffffffffffffff"
        );
      }

      if (status === "correct" || status === "error") {
        setStatus("active");
      }

      // Remove the event listener after the first call
      window.removeEventListener("keydown", handleKeyPress);
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [status]);

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
    setPrevquestion(initialHotQuestions[0]);

    // Focus the input after loading
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [questions]);

  // Start timer when quiz begins
  const startTimer = () => {
    setIsTimerRunning(true);
  };

  // Stop timer when quiz finishes
  const stopTimer = (time: number) => {
    setIsTimerRunning(false);
  };
  const handleStopTimer = (time: number) => {
    setTotalTime(time);
  };

  // Function to handle right swipe (e.g., load next question)
  const handleRightSwipe = () => {
    console.log("Right swipe detected");
  };

  // Function to handle left swipe (you can add other logic here)
  const handleLeftSwipe = () => {
    console.log("Left swipe detected");
    // Implement logic for left swipe if needed
  };

  const shuffleArray = (array: Question[]): Question[] => {
    return array.sort(() => Math.random() - 0.5);
  };

  const getTotalErrorCount = () => {
    return shuffledQuestions.reduce((sum, q) => sum + q.errors, 0);
  };

  const speakAnswer = async (text: string) => {
    const apiKey = "AIzaSyB1bktNK2YnF5VK0ARGlHIa3a_y7aVeJ70"; // Replace with your actual API Key

    try {
      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          input: {
            text: text, // The text to be converted to speech
          },
          voice: {
            languageCode: "en-US", // Change to the desired language code
            ssmlGender: "NEUTRAL", // Gender (can be MALE, FEMALE, or NEUTRAL)
          },
          audioConfig: {
            audioEncoding: "MP3", // Audio format (MP3, LINEAR16, or OGG_OPUS)
          },
        },
        {
          headers: {
            "Content-Type": "application/json", // Specify JSON format
          },
        }
      );

      const audioContent = response.data.audioContent;
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error in speakAnswer:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const correctStuff = () => {
    speakAnswer(currentQuestion?.odpowiedz);
    setIsCorrect(true);
    setStatus("correct");
    // Move the question to guessed state
    updateQuestionStatus(currentQuestion.index, { guessed: 1, hot: 0 }); // Changed from active to hot
    // Reset user answer
    setUserAnswer("");
    // Check if quiz is finished after marking the question as guessed

    NewHotQuestion(); // Changed from NewActiveQuestion to NewHotQuestion
  };

  const inCorrectStuff = () => {
    speakAnswer(currentQuestion?.odpowiedz);
    setIsCorrect(false);
    setStatus("error");
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

      // Check if quiz is finished after marking the question

      NewHotQuestion(); // Changed from NewActiveQuestion to NewHotQuestion
    }
  };

  const handleCheckAnswer = (mark) => {
    if (mode === "test") {
      if (!currentQuestion || userAnswer.trim() === "") return;
    }

    // speakAnswer(currentQuestion.odpowiedz);

    // Ensure correct answer is trimmed and lowercased
    const correctAnswer = currentQuestion.odpowiedz.trim().toLowerCase();
    const userAnswerTrimmed = userAnswer.trim().toLowerCase();

    // Check if the answer is correct
    const isAnswerCorrect =
      mode === "test" ? userAnswerTrimmed === correctAnswer : mark;

    if (isAnswerCorrect) {
      correctStuff();
    } else {
      inCorrectStuff();
    }

    NewCurrentQuestion();
  };

  const updateQuestionStatus = (index: number, updates: Partial<Question>) => {
    setShuffledQuestions((prev) =>
      prev.map((q) => (q.index === index ? { ...q, ...updates } : q))
    );
  };

  const NewHotQuestion = () => {
    const nextHotQuestion = shuffledQuestions.find((q) =>
      !isRepeatChecked
        ? q.hot === 0 && q.guessed === 0
        : q.hot === 0 && q.guessed === 0 && q.errors === 0
    );

    // If we find a question, we mark it as hot.
    if (nextHotQuestion) {
      updateQuestionStatus(nextHotQuestion.index, { hot: 1 });
    }
  };

  const NewCurrentQuestion = () => {
    setPrevquestion(currentQuestion?.odpowiedz);
    // Filter the available questions (hot and not guessed)
    const availableQuestions = shuffledQuestions.filter(
      (q) => q.hot === 1 && q.index !== currentQuestion?.index
    );

    // Randomly select one of the available questions
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const nextQuestion = availableQuestions[randomIndex];

      setCurrentQuestion(nextQuestion);
      console.log("-----------------" + nextQuestion.odpowiedz);
    } else {
      stopTimer(totalTime); // Stop the timer
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }

    setUserAnswer("");
  };

  const getFilteredGuessedQuestions = () => {
    return shuffledQuestions.filter((q) => q.guessed === 1);
  };

  const getFilteredHotQuestions = () => {
    return shuffledQuestions.filter((q) => q.hot === 1);
  };

  const getFilteredErrorQuestions = () => {
    return shuffledQuestions.filter((q) => q.errors > 0);
  };

  const isQuizFinished =
    allQuestions.length === getFilteredGuessedQuestions().length ||
    (isRepeatChecked &&
      getFilteredGuessedQuestions().length +
        getFilteredErrorQuestions().length ===
        allQuestions.length &&
      getFilteredHotQuestions().length === 0);

  // Modify the function to handle the status change when quiz starts
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === "active") {
      startTimer(); // Start the timer when status changes to active
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-6">
      {/* Timer Component */}
      <Timer isRunning={isTimerRunning} onStop={handleStopTimer} />

      <SwipeListener
        onSwipeRight={handleRightSwipe}
        onSwipeLeft={handleLeftSwipe} // Optional, only if you need left swipe handling
      />

      <p>{userAnswer}</p>
      <Progress
        totalQuestions={allQuestions.length}
        guessedCount={getFilteredGuessedQuestions().length}
        incorrectCount={getTotalErrorCount()} // Pass the sum of all errors
      />

      <Settings
        isRepeatChecked={isRepeatChecked}
        setIsRepeatChecked={setIsRepeatChecked}
      />

      {status === "intro" && (
        <IntroCard
          mode={mode}
          setMode={setMode}
          status={status}
          setStatus={handleStatusChange} // Updated this line
        />
      )}

      {status === "correct" && (
        <CorrectCard
          question={currentQuestion.pytanie}
          correctAnswer={currentQuestion.odpowiedz}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          isCorrect={isCorrect}
          setStatus={setStatus}
          inputRef={inputRef}
          prevquestion={prevquestion}
          status={status}
          speakAnswer={speakAnswer}
        />
      )}
      {status === "error" && (
        <ErrorCard
          correctAnswer={currentQuestion.odpowiedz}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          setStatus={setStatus}
          prevquestion={prevquestion}
          status={status}
          speakAnswer={speakAnswer}
        />
      )}

      {!isQuizFinished && currentQuestion && status === "active" && (
        <QuestionCard
          correctAnswer={currentQuestion.odpowiedz}
          question={currentQuestion.pytanie}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          onCheckAnswer={handleCheckAnswer}
          inputRef={inputRef}
          status={status}
          mode={mode}
          NewCurrentQuestion={NewCurrentQuestion}
          correctStuff={correctStuff}
          inCorrectStuff={inCorrectStuff}
          speakAnswer={speakAnswer}
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
          guessedCount={getFilteredGuessedQuestions().length}
          incorrectCount={getTotalErrorCount()}
          totalQuestions={allQuestions.length}
          stopTimer={stopTimer}
          totalTime={totalTime} // Pass the total time taken to FinalScore
        />
      )}
    </div>
  );
};

export default QuestionManager;
