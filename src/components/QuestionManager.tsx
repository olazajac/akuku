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
import Hint from "./Hint";
import Stopper from "./Stopper";
import ScoreTable from "./ScoreTable";
import { useTimer } from "../hooks/useTimer";
import QuestionLists from "./QuestionLists"; // Import the new component




 





type Question = {
  pytanie: string; // The question text
  odpowiedz: string; // The correct answer
  hot: number; // Hot status
  guessed: number; // Guessed status
  errors: number; // Error count
  index: number; // Unique index
};

interface Results {
  date: string;
  time: string;
  score: string;
  test_id: string;
  mistakes: {
    pytanie: string;
    odpowiedz: string;
  }[];
}





const QuestionManager: React.FC<{
  questions: { pytanie: string; odpowiedz: string }[];
  testId: number;
}> = ({ questions,testId }) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const [userAnswer, setUserAnswer] = useState<string>("");
  const [status, setStatus] = useState<string>("intro");
  const [mode, setMode] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isRepeatChecked, setIsRepeatChecked] = useState<boolean>(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const [prevquestion, setPrevquestion] =   useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [doubleChecked, setDoubleChecked] = useState<number>(0);


  
  const {  time, startTimer, stopTimer, minutes, seconds } = useTimer();

  useEffect(() => {
    console.log("User Answer:", userAnswer);
  }, [userAnswer]);


  


  


  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {


      if (status === "active" && mode === "learn" && !isQuizFinished) {

        
        if (event.key === "ArrowRight") {

          
          if (doubleChecked){

            setDoubleChecked(0)
            handleCheckAnswer(true); 

          } else { 
            setDoubleChecked(1)}
          
          
                 

        }
        if (event.key === "ArrowLeft") {
          setDoubleChecked(0)
          handleCheckAnswer(false);
        } 
      }
      

      if (event.ctrlKey && event.key.toLowerCase() === "q") {

        setShowHint(true)

        setInterval(() => {
          setShowHint(false);
        }, 1000);

        
        event.preventDefault(); // Optional: prevents default browser behavior if needed
      }

      if (status === "correct" || status === "error") {
        setStatus("active");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [status, mode, doubleChecked]);

    // Function to handle right swipe (e.g., load next question)
    const handleRightSwipe = () => {
      console.log("Right swipe detected");
    };
  
    // Function to handle left swipe (you can add other logic here)
    const handleLeftSwipe = () => {
      console.log("Left swipe detected");
      // Implement logic for left swipe if needed
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
    setPrevquestion(initialHotQuestions[0]?.odpowiedz ?? null);

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










  

  const correctStuff = () => {

    if (currentQuestion) {
    speakAnswer(currentQuestion.odpowiedz);
    setStatus("correct");

    // Move the question to guessed state
    updateQuestionStatus(currentQuestion.index, { guessed: 1, hot: 0 }); // Changed from active to hot
  }
    // Reset user answer
    setUserAnswer("");
    // Check if quiz is finished after marking the question as guessed

    NewHotQuestion(); // Changed from NewActiveQuestion to NewHotQuestion
  };

  const inCorrectStuff = () => {

    if (currentQuestion) {
    speakAnswer(currentQuestion.odpowiedz);

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
  }
  };



  const handleCheckAnswer = (result: boolean) => {

   

    if (currentQuestion) {

    if (mode === "test") {
      if (!currentQuestion || userAnswer.trim() === "") return;
    }


    // Ensure correct answer is trimmed and lowercased
    const correctAnswer = currentQuestion.odpowiedz.trim().toLowerCase();
    const userAnswerTrimmed = userAnswer.trim().toLowerCase();

    // Check if the answer is correct
    const isAnswerCorrect =  mode === "test" ? userAnswerTrimmed === correctAnswer : result ;

    

    if (isAnswerCorrect) {
      correctStuff();
    } else {
      inCorrectStuff();
    }

    NewCurrentQuestion();
  }
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
    setPrevquestion(currentQuestion?.odpowiedz ?? null);
    // Filter the available questions (hot and not guessed)
    const availableQuestions = shuffledQuestions.filter(
      (q) => q.hot === 1 && q.index !== currentQuestion?.index
    );

    // Randomly select one of the available questions
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const nextQuestion = availableQuestions[randomIndex];

      setCurrentQuestion(nextQuestion);
      
    } else {


      stopTimer(); // Stop the timer

      
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // setUserAnswer("");
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


  useEffect(() => {
    // in order to save results in acf
    if (isQuizFinished && time > 0) {
      console.log("Quiz finished with total time:", time);
      handleTestCompletion(); // Ensure totalTime is finalized before calling
    }
  }, [isQuizFinished, time]);

  



const saveTestResults = async (results: Results) => {

  const pageId = 24737; // Your page ID

    // Validate score before proceeding
    if (isNaN(Number(results.score))) {
      // console.error("Invalid score: NaN. Skipping API call.");
      return; // Exit the function early
    }

  try {
    // Step 1: Fetch the existing data
    const fetchResponse = await fetch(`https://akuku.club/wp-json/wp/v2/pages/${pageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("ola:F0JP 6SLF Dk6n JaMJ Jr3O v1lj"), // Replace with your credentials
      },
    });

    if (!fetchResponse.ok) {
      throw new Error(`HTTP error fetching existing data! Status: ${fetchResponse.status}`);
    }
    
    const fetchResult = await fetchResponse.json();
    
    // Step 1: Retrieve existing rows or initialize empty arrays
    const existingEntries = fetchResult.acf?.single_entry || []; // For main repeater
    const existingMistakes = fetchResult.acf?.mistakes || []; // For mistakes repeater
    
    // Step 2: Prepare new entry for 'single_entry'
    const newEntry = {
      date: results.date,
      time: results.time,
      score: results.score,
      test_id: results.test_id,
      mistakes: results.mistakes.map((mistake) => ({
        pytanie: mistake.pytanie,
        odpowiedz: mistake.odpowiedz,
        
      })), // Map mistakes into the proper structure
    };
    
    // Step 3: Prepare updated mistakes (append new ones)
    const updatedMistakes = [
      ...existingMistakes,
      ...results.mistakes.map((mistake) => ({
        pytanie: mistake.pytanie,
        odpowiedz: mistake.odpowiedz,
      })),
    ];
    
    // Step 4: Prepare the updated data payload
    const postData = {
      acf: {
        single_entry: [...existingEntries, newEntry], // Add the new entry to single_entry
        mistakes: updatedMistakes, // Update the mistakes field with new entries
      },
    };
    
    console.log("Payload being sent:", JSON.stringify(postData, null, 2)); // Debugging payload
    

    const updateResponse = await fetch(`https://akuku.club/wp-json/wp/v2/pages/${pageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("ola:F0JP 6SLF Dk6n JaMJ Jr3O v1lj"), // Replace with your credentials
      },
      body: JSON.stringify(postData),
    });

    if (!updateResponse.ok) {
      throw new Error(`HTTP error updating data! Status: ${updateResponse.status}`);
    }

    const updateResult = await updateResponse.json();
    console.log("Test results appended successfully:", updateResult);
  } catch (error) {
    console.error("Failed to append test results:", error);
  }
};

  
  

  
const handleTestCompletion = () => {

  
  const totalQuestions =
    getFilteredGuessedQuestions().length + getTotalErrorCount();
  const score =
    totalQuestions > 0
      ? ((getFilteredGuessedQuestions().length * 100) / totalQuestions).toFixed(0)
      : "0"; // Handle edge case where totalQuestions is 0


  const results = {
    date: new Date().toISOString().split("T")[0],
    time: `${minutes}:${seconds}`, // Use formatted time
    score: score,
    test_id: testId.toString(),
    mistakes: getFilteredErrorQuestions().map((question) => ({
      pytanie: question.pytanie,
      odpowiedz: question.odpowiedz,
    })),
  };

  console.log("Test completion data:", results); // Debugging log
  saveTestResults(results);
};




const handleRedoMistakes = (mistakes: { pytanie: string; odpowiedz: string }[], mode: string) => {
  // Initialize questions
  const initializedQuestions = mistakes.map((q, index) => ({
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
  setPrevquestion(initialHotQuestions[0]?.odpowiedz ?? null);

  setMode(mode);
  
  setStatus("active");
  startTimer()

   // Scroll to the top of the page
   window.scrollTo({
    top: 0,
    behavior: "smooth", // Adds a smooth scrolling effect
  });

  // Focus the input after restarting
  if (inputRef.current) {
    inputRef.current.focus();
  }
};

  

  return (
    <div className="flex flex-col items-center pb-8 bg-emerald-600 min-h-screen content-start">
      {/* Timer Component */}
      
      <SwipeListener
        onSwipeRight={handleRightSwipe}
        onSwipeLeft={handleLeftSwipe} // Optional, only if you need left swipe handling
      />



<div className="timer">
        <p className="text-xs text-gray-500 bg-gray-100 rounded-lg px-2 py-1" > {minutes}:{seconds}</p>
      </div>
    
      <Progress
        isRepeatChecked={isRepeatChecked}
        totalQuestions={allQuestions.length}
        guessedCount={getFilteredGuessedQuestions().length}
        incorrectCount={getTotalErrorCount()} // Pass the sum of all errors
      />

      <Settings
        isRepeatChecked={isRepeatChecked}
        setIsRepeatChecked={setIsRepeatChecked}
      />
         {showHint && <Hint correctAnswer = {currentQuestion?.odpowiedz} /> } 
      {status === "intro" && (
        <IntroCard
          mode={mode}
          setMode={setMode}
          setStatus={handleStatusChange} // Updated this line
          startTimer={startTimer} // Use timer's start method
        />
      )}

      {status === "correct" && (
        <CorrectCard
          // inputRef={inputRef}
          prevquestion={prevquestion}
          setStatus={handleStatusChange} // Updated this line
        />
      )}
      {status === "error" && (
        <ErrorCard
          userAnswer={userAnswer}
          setStatus={handleStatusChange}
          prevquestion={prevquestion}
          speakAnswer={speakAnswer}
          mode={mode}
        />
      )}

      {!isQuizFinished && currentQuestion && status === "active" && (
        <QuestionCard

          question={currentQuestion.pytanie}
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
          onCheckAnswer={handleCheckAnswer}
          inputRef={inputRef}
          status={status}
          mode={mode}
          doubleChecked={doubleChecked}
          setDoubleChecked={setDoubleChecked}
        />
      )}



{!isQuizFinished && mode === 'learn' && (<Stopper status={status} onCheckAnswer={handleCheckAnswer} />)}

{isQuizFinished && (
        <FinalScore
          guessedCount={getFilteredGuessedQuestions().length}
          incorrectCount={getTotalErrorCount()}
          totalQuestions={allQuestions.length}
          totalTime={time} // Pass the total time taken to FinalScore
        />
      )}


      
      <div className="mt-4">
     



      <QuestionLists
        shuffledQuestions={shuffledQuestions}
        onSpeakAnswer={speakAnswer}
        status={status}
      />

     


      </div>

      {status === "intro" &&
      <ScoreTable testId={testId.toString()} onRedoMistakes={handleRedoMistakes} />}



    </div>
  );
};

export default QuestionManager;
