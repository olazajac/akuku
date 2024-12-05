import React, { useEffect, useState } from "react";

interface StopperProps {
  status: string;
  onCheckAnswer: (result: boolean) => void;
  initialCounter?: number; // Allow the initial counter value to be passed as a prop

}

const Stopper: React.FC<StopperProps> = ({ status, onCheckAnswer, initialCounter=10, }) => {
  const [counter, setCounter] = useState(initialCounter);
  const [isCounting, setIsCounting] = useState(false); // Control whether the countdown is active




  useEffect(() => {
    if (status === "active") {
      setCounter(initialCounter); // Reset counter when activated
      setIsCounting(true);
      
    } else {
      handleSkip();
    }
  }, [status, setCounter, setIsCounting]);





  useEffect(() => {
    if (isCounting && counter > 0) {


      const stopertimer = setTimeout(() => {
        setCounter((prevCounter) => (prevCounter !== undefined ? prevCounter - 1 : 0));
      }, 1000);

      return () => clearTimeout(stopertimer); // Clear timeout on component unmount or dependency change
    } else if (counter === 0) {

      setIsCounting(false);

      const tooLate = setTimeout(() => {
        onCheckAnswer(false); // Trigger on timeout
      }, 100);

      return () => clearTimeout(tooLate); // Clear timeout on component unmount or dependency change
      
      
    }
  }, [counter, isCounting, setCounter]);





  const handleSkip = () => {
    setCounter(initialCounter); // Reset counter
    setIsCounting(false); // Stop the countdown
  };

  return (
    <div className="w-full m-0 p-0" >
      <div
        className="bg-gray-500 h-1"
        style={{
          width: `${(!isCounting) ? 100 : 0}%`, // Dynamically calculate width based on initialCounter
          
          transition: status === "active" ? `width ${initialCounter}s linear`  : "none",
        }}
      ></div>
      {/* <p style={{ fontSize: "2rem", color: counter === 0 ? "red" : "black" }}>
        {counter}
      </p> */}
      
    </div>
  );
};

export default Stopper;
