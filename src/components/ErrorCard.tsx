

interface ErrorCardProps {
  userAnswer: string;
  setStatus: string;
  setUserAnswer: string;
  prevquestion: any;
  speakAnswer: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({
  userAnswer,
  setStatus,
  prevquestion,
  speakAnswer,
}) => {
  return (
    <div
      className="mb-4 p-4 border rounded-md shadow-md bg-red-100"
      onClick={() => {
        setStatus("active");
      }}
    >
      <h2 className="text-lg font-semibold text-red-500">Error!</h2>
      <p className="mt-2 text-lg">
        <strong>Correct Answer: {prevquestion}</strong>
      </p>
      <p className="mt-2 text-lg">
        <strong>You answered:</strong> {userAnswer}
      </p>
      {/* Listen Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          speakAnswer(prevquestion);
        }}
      >
        Listen to Answer
      </button>
      <p className="mt-2">Press any key to continue to the next question.</p>
    </div>
  );
};

export default ErrorCard;
