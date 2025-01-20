import { useEffect } from "react";


interface ErrorCardProps {
  userAnswer: string;
  setStatus: (status: string) => void;
  prevquestion: any;
  speakAnswer: (status: string) => void;
  mode: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({
  userAnswer,
  setStatus,
  prevquestion,
  speakAnswer,
  mode
}) => {

  useEffect(() => {
    const autoOff = setTimeout(() => {
      console.log("Auto advanced to next question."); // Debug: Confirm timeout triggers
      setStatus("active");
      clearTimeout(autoOff);
    }, 8000);

    

    return () => {
      clearTimeout(autoOff);
    };
  }, [setStatus]);


  
    return (
      <div
        className="min-h-screen bg-sky-900 p-4 w-full  flex flex-col items-center content-center  flex-grow "
        onClick={() => {
          setStatus("active");
        } }
      >

<h2 className="text-[30px] md:text-[20px] text-pink-300 font-bold my-10 text-center">  <strong>{prevquestion}</strong></h2>
        
       
        <p className="mt-2 text-sm text-center">
          {mode === 'test' && <strong>You answered:</strong> }
          
        </p>
        <p  className="mt-2 text-lg">
        {userAnswer}
        </p>
        {/* Listen Button */}
        <button className="text-center "
          onClick={(e) => {
            e.stopPropagation();
            speakAnswer(prevquestion);
          } }
        >
          Listen to Answer
        </button>
        {/* <p className="mt-2">Press any key to continue to the next question.</p> */}
      </div>
    );
  };

export default ErrorCard;
