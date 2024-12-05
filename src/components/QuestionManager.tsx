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
import Image from "next/image";




type Question = {
  pytanie: string; // The question text
  odpowiedz: string; // The correct answer
  hot: number; // Hot status
  guessed: number; // Guessed status
  errors: number; // Error count
  index: number; // Unique index
};


interface NewEntry {
  date: string; // e.g., "2024-11-30"
  time: string; // e.g., "00:13"
  score: string; // e.g., "69"
  test_id: string; // e.g., "24620"
  mistakes: {
    pytanie: string; // The question text
    odpowiedz: string; // The correct answer
    
  }[]; // An array of mistakes
  test_type: string;
    hint: number;
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
  const [hintCount, setHintCount] = useState<number>(0);



  
  useEffect(() => {
    // Add or remove `overflow-y-hidden` based on status
    if (status === "active" || status === "error" || status === "correct") {
      document.body.classList.add("overflow-y-hidden");
    } else {
      document.body.classList.remove("overflow-y-hidden");
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, [status]);

  


  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {


      if (status === "active" && mode === "learn" && !isQuizFinished) {

        
        if (event.key === "ArrowRight") {

          
          if (doubleChecked){

            setDoubleChecked(0)
            handleCheckAnswer(true); 

          } else { 
            setDoubleChecked(1)
            if (currentQuestion) {
            speakAnswer(currentQuestion?.odpowiedz)
            }
          }
          
          
                 

        }
        if (event.key === "ArrowLeft") {
          setDoubleChecked(0)
          handleCheckAnswer(false);
        } 
      }
      

      if (event.ctrlKey && event.key.toLowerCase() === "q") {

        setShowHint(true)
        setHintCount(prevCount => prevCount + 1)

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

          if(status === 'active'){
            if (doubleChecked){

              setDoubleChecked(0)
              handleCheckAnswer(true); 
    
            } else { 
              setDoubleChecked(1)}
           
        }

        

     
          }
     
  
    // Function to handle left swipe (you can add other logic here)
    const handleLeftSwipe = () => {

      if(status === 'active'){
      setDoubleChecked(0)
        handleCheckAnswer(false);
      }
    
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
    // speakAnswer(currentQuestion.odpowiedz);
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
    } else if (newStatus === "finished") {
      stopTimer(); // Start the timer when status changes to active
    } 
  };


  useEffect(() => {
    // in order to save results in acf
    if (isQuizFinished && time > 0) {
      setStatus('finished')
      
      console.log("Quiz finished with total time:", time);
      handleTestCompletion(); // Ensure totalTime is finalized before calling
    }
  }, [isQuizFinished, time]);

  



const appendNewEntry = async (pageId: number, newEntry: NewEntry) => {
  try {
    const response = await fetch("https://akuku.club/wp-json/custom/v1/append_entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("ola:F0JP 6SLF Dk6n JaMJ Jr3O v1lj"), // 
      },
      body: JSON.stringify({
        page_id: pageId,
        new_entry: newEntry,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to append entry. Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Successfully appended entry:", result);
  } catch (error) {
    console.error("Error appending entry:", error);
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
    time: `${(minutes ?? 0).toString().padStart(2, "0")}:${(seconds ?? 0).toString().padStart(2, "0")}`,

    // time: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`, // Ensure double-digit formatting
    // time: '22',
    score: score,
    test_id: testId.toString(),
    mistakes: getFilteredErrorQuestions().map((question) => ({
      pytanie: question.pytanie,
      odpowiedz: question.odpowiedz,
      
    })),
    test_type: mode,
      hint: hintCount,
  };

  console.log("Test completion data:", results); // Debugging log
  // saveTestResults(results);

  // Append only the new entry
appendNewEntry(24737, results);
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
    <>
      {/* Timer Component */}
      
      <SwipeListener
        onSwipeRight={handleRightSwipe}
        onSwipeLeft={handleLeftSwipe} // Optional, only if you need left swipe handling
      />

<div className="topbar bg-gray-300 text-white w-full p-4 flex flex-col justify-around content-center items-center  ">
<a href="../">
<Image
        src="/images/logo.svg" // Path relative to the `public` folder
        alt="Description of image"
        width={50} // Specify width
        height={50} // Specify height
        className="justify-self-start mr-auto"
      /></a>

<Progress
        isRepeatChecked={isRepeatChecked}
        totalQuestions={allQuestions.length}
        guessedCount={getFilteredGuessedQuestions().length}
        incorrectCount={getTotalErrorCount()} // Pass the sum of all errors
        seconds={seconds}
        minutes={minutes}
      />





</div>

{!isQuizFinished && mode === 'learn' && (<Stopper status={status} onCheckAnswer={handleCheckAnswer} initialCounter={20} />)}


         {showHint && <Hint correctAnswer = {currentQuestion?.odpowiedz} /> } 
      {status === "intro" && (
        <IntroCard
          mode={mode}
          setMode={setMode}
          setStatus={handleStatusChange} // Updated this line
          startTimer={startTimer} // Use timer's start method
          totalQuestions={allQuestions.length}
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
          answear={currentQuestion.odpowiedz}
          speakAnswer={speakAnswer}
        />
      )}





{isQuizFinished && (
        <FinalScore
          guessedCount={getFilteredGuessedQuestions().length}
          incorrectCount={getTotalErrorCount()}
          totalQuestions={allQuestions.length}
          minutes={minutes} // Pass the total time taken to FinalScore
          seconds={seconds}
        />
      )}


      


      {status === "intro" &&
      <>
      <Settings
          isRepeatChecked={isRepeatChecked}
          setIsRepeatChecked={setIsRepeatChecked} />
      <ScoreTable testId={testId.toString()} onRedoMistakes={handleRedoMistakes} />
          </>
      }



  <> 




<QuestionLists
        shuffledQuestions={shuffledQuestions}
        onSpeakAnswer={speakAnswer}
        status={status}
      />
      </>
      
      



    </>
  );
};

export default QuestionManager;
