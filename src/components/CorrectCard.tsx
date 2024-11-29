import React, { useEffect } from "react";


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
    }, 3000);

    

    return () => {
      clearTimeout(autoOff);
    };
  }, []);




    





  return (
    <div
      className="mb-4 p-4 border rounded-md shadow-md bg-green-100"
      onClick={() => {
        setStatus("active");

        // NewCurrentQuestion();
      }}
    >
      <h2 className="text-lg font-semibold text-green-500">Good!</h2>
      <p>{prevquestion}</p>

      {/* <p className="mt-2">Press any key to continue to the next question.</p> */}
    </div>
  );
};

export default CorrectCard;
