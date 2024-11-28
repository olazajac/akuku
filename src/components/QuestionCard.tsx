import React, { useEffect } from "react";
import Button from "./Button";

interface QuestionCardProps {
  question: string;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  onCheckAnswer: (result: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  status: string;
  mode: string;

}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  onCheckAnswer,
  inputRef,
  status,
  mode,

}) => {
  useEffect(() => {
    // Focus the input after loading
    if (inputRef.current) {
      setUserAnswer("");
      inputRef.current.focus();
    }
  }, [status, inputRef, setUserAnswer]);

  return (
    <div className="mb-4 p-4 ">
      <h2 className="text-lg font-semibold text-center">{question}</h2>

      {mode === "test" && (
        <>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            ref={inputRef}
            className="mt-2 mb-3 border-2 rounded-md rounded w-full p-5 text-center"
            placeholder="Type your answer"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTimeout(() => {
                  onCheckAnswer(false); // Call onCheckAnswer when Enter is pressed
                }, 200);
              }
            }}
          />



<Button
        text="Submit"
        backgroundColor="bg-green-600 hover:bg-green-700 mt-1 w-full"
        textColor="text-white"
        onClick={() => onCheckAnswer(true)}
      />

          
        </>
      )}

      {mode === "learn" && (
        <div className="flex flex-row">
          
          <Button
        text="Nie umiem"
        backgroundColor="m-2 bg-red-600 hover:bg-red-700 w-48"
        textColor="text-white"
        onClick={() => onCheckAnswer(false)}
      />
          <Button
        text="Umiem"
        backgroundColor="m-2 bg-green-600 hover:bg-green-700 w-48"
        textColor="text-white"
        onClick={() => onCheckAnswer(true)}
      />
           </div>
  

       



      
        
      )}
    </div>
  );
};

export default QuestionCard;
