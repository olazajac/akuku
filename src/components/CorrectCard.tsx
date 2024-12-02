import React, { useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";



interface CorrectCardProps {
  
  setStatus: (status: string) => void;
  // inputRef: React.RefObject<HTMLInputElement>;
  prevquestion: any;

}

const CorrectCard: React.FC<CorrectCardProps> = ({
  
  setStatus,
  prevquestion,

}) => {



  useEffect(() => {
    const autoOff = setTimeout(() => {
      console.log("Auto advanced to next question."); // Debug: Confirm timeout triggers
      setStatus("active");
      clearTimeout(autoOff);
    }, 8000000);

    

    return () => {
      clearTimeout(autoOff);
    };
  }, [setStatus]);






  return (

    <div className="bg-green-100 p-4 w-full  flex flex-col items-center content-center  h-full "  onClick={() => {
      setStatus("active");

      // NewCurrentQuestion();
    }}>





      <h2 className="text-2xl text-emerald-800 text-white font-bold my-10 text-center">{prevquestion}</h2>


<Player
  autoplay
  loop={false}
  src="/animations/success.json" // Path to the animation file
  style={{ maxWidth: "100%" }}

/>
 




      {/* <p className="mt-2">Press any key to continue to the next question.</p> */}
    </div>
  );
};

export default CorrectCard;
