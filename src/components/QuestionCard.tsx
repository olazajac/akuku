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
    <div className="mb-4 p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold">{question}</h2>

      {mode === "test" && (
        <>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            ref={inputRef}
            className="mt-2 p-2 border rounded w-full"
            placeholder="Type your answer"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setTimeout(() => {
                  onCheckAnswer(false); // Call onCheckAnswer when Enter is pressed
                }, 200);
              }
            }}
          />

          <button
            onClick={() => onCheckAnswer(true)}
            className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </>
      )}

      {mode === "learn" && (
        <>
             <Button
        text="Nie umiem"
        backgroundColor="m-2 bg-red-600 hover:bg-red-700"
        textColor="text-white"
        onClick={() => onCheckAnswer(false)}
      />
          <Button
        text="Umiem"
        backgroundColor="m-2 bg-green-600 hover:bg-green-700"
        textColor="text-white"
        onClick={() => onCheckAnswer(true)}
      />

       



      
        </>
      )}
    </div>
  );
};

export default QuestionCard;
