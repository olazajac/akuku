import React, { useEffect, useState } from 'react';

interface StopperProps {
    status: string;
    onCheckAnswer: (result: boolean) => void;
}



const Stopper: React.FC<StopperProps> = ({
    status,
    onCheckAnswer,
  
  }) => {
  const [counter, setCounter] = useState(10);
  const [isCounting, setIsCounting] = useState(false); // Control whether the countdown is active

  useEffect(() => {
    
    status === 'active' && setIsCounting(true)
    status !== 'active' && handleSkip()

    if (counter > 0 && isCounting) {
      const timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear interval on component unmount or dependency change
    } else if (counter === 0) {  
    onCheckAnswer(false); 
    setIsCounting(false);
    setCounter(10); // Instantly set to 0 
    }
  }, [counter, isCounting, status]);

  const handleSkip = () => {
    setCounter(10); // Instantly set to 0
    setIsCounting(false); 
    // setIsCounting(false); // Stop the countdown to prevent restart
    
  };

  return (
    <div style={{ width: '400px', textAlign: 'center', marginTop: '20px' }}>
        <div className=" bg-[red] h-1" style={{ width: (counter-1)/10*100+'%', transition: status === 'active' ? 'width 1s linear' : 'none', }} >  </div>
      <p style={{ fontSize: '2rem', color: counter === 0 ? 'red' : 'black' }}>
        {/* {counter} */}
      </p>
      <button onClick={handleSkip} style={{ marginTop: '10px', padding: '8px 16px' }}>
        {/* Skip to End */}
      </button>
    </div>
  );
};

export default Stopper;

