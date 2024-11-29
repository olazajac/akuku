import React, { useEffect } from "react";

interface CorrectCardProps {
  correctAnswer: string;
  setStatus: (status: string) => void;
}

const CorrectAnswer: React.FC<CorrectCardProps> = ({
  correctAnswer,
  setStatus,
}) => {
  // Key press event listener to move to next question in error state
  useEffect(() => {
    const handleKeyPress = () => {
      setStatus("active");
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [setStatus]);


  

  return (
    <div className="mb-4 p-4 border rounded-md shadow-md bg-red-100">
      <h2 className="text-lg font-semibold text-green-500">Good!</h2>
      <p className="mt-2 text-lg">
        <strong>Correct Answer:</strong> {correctAnswer}
      </p>
      <p className="mt-2">Press any key to continue to the next question.</p>
    </div>
  );
};

export default CorrectAnswer;
