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
  doubleChecked: number;
  setDoubleChecked: (result: number) => void; 
  answear: string;
  speakAnswer: (status: string) => void;

}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  setUserAnswer,
  onCheckAnswer,
  inputRef,
  status,
  mode,
  doubleChecked,
  setDoubleChecked,
  answear,
  speakAnswer,

}) => {
  useEffect(() => {
    // Focus the input after loading
    if (inputRef.current) {
      setUserAnswer("");
      inputRef.current.focus();
    }
  }, [status, inputRef, setUserAnswer]);

  return (
    <div className="p-4 w-full  flex flex-col items-center content-center flex-grow ">
      <h2 className="text-[50px] text-gray-900 font-bold my-10 text-center mt-[15vh] mb-[15vh]">{question}  {doubleChecked ? ' - ' + answear : ''}</h2>


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
        backgroundColor="bg-green-600 hover:bg-green-700 mt-1 w-full py-8"
        textColor="text-white"
        onClick={() => onCheckAnswer(true)}
      />



        </>
      )}

      {mode === "learn" && (
        <div className="max-w-full flex flex-row items-center">
          
          <Button
        text="Nie umiem"
        backgroundColor="max-w-full m-2 bg-emerald-900 hover:bg-emerald-900 w-48 py-8"
        textColor="text-white"
        onClick={() => { 
          setDoubleChecked(0)
          onCheckAnswer(false)
        }


        }
      />


{doubleChecked ?  <Button
        text="Umiem"
        backgroundColor="max-w-full m-2 bg-green-500 hover:bg-green-700 w-48 py-8"
        textColor="text-white"
        onClick={() => {
          setDoubleChecked(0)
          onCheckAnswer(true)
        }
        }
      /> : <Button
      text="Sprawdz"
      backgroundColor="max-w-full m-2 bg-green-500 hover:bg-green-700 w-48 py-8"
      textColor="text-white"
      onClick={() => {setDoubleChecked(1)
                      speakAnswer(answear);
      }}
    />

} 



           </div>
  

       



      
        
      )}
    </div>
  );
};

export default QuestionCard;
