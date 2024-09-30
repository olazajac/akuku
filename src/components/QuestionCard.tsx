import React, { useEffect } from "react";

const QuestionCard: React.FC<{
  question: string;
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  onCheckAnswer: () => void;
  inputRef: React.RefObject<HTMLInputElement>; // Accept the inputRef prop
}> = ({ question, userAnswer, setUserAnswer, onCheckAnswer, inputRef }) => {
  // Handle key press event to check answer on Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      onCheckAnswer(); // Call the onCheckAnswer function passed as a prop
    }
  };

  // Focus the input field after the component mounts
  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]); // Run effect when inputRef changes

  return (
    <div className="border p-4 rounded-md shadow-md">
      <h2 className="text-xl mb-4">{question}</h2>
      <input
        ref={inputRef} // Attach the inputRef to the input element
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyPress={handleKeyPress} // Attach the key press handler
        className="border rounded p-2 w-full"
        placeholder="Type your answer here"
      />
      <button
        onClick={onCheckAnswer}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Check Answer
      </button>
    </div>
  );
};

export default QuestionCard;
