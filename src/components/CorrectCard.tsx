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
    }, 400);

    

    return () => {
      clearTimeout(autoOff);
    };
  }, [setStatus]);






  return (

    <div className=" p-4 w-full  flex flex-col items-center content-center flex-grow "  onClick={() => {
      setStatus("active");

      // NewCurrentQuestion();
    }}>





      <h2 className="text-[30px] md:text-[20px] text-emerald-800 font-bold my-10 text-center">{prevquestion}</h2>


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
