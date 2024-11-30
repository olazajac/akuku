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
    }, 800);

    

    return () => {
      clearTimeout(autoOff);
    };
  }, []);




    





  return (

    <div className="mb-4 p-4 w-full flex flex-col items-center content-center"  onClick={() => {
      setStatus("active");

      // NewCurrentQuestion();
    }}>





      <h2 className="text-2xl text-emerald-800 text-white font-bold my-10 text-center">{prevquestion}</h2>

      <div className="inset-0 flex items-center justify-center top-[-600px]"> 
<Player
  autoplay
  loop={false}
  src="/animations/success.json" // Path to the animation file
  style={{ height: "550px", width: "550px" }}

/>
 </div>




      {/* <p className="mt-2">Press any key to continue to the next question.</p> */}
    </div>
  );
};

export default CorrectCard;
