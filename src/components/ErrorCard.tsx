

interface ErrorCardProps {
  userAnswer: string;
  setStatus: (status: string) => void;
  prevquestion: any;
  speakAnswer: (status: string) => void;
}

const ErrorCard: React.FC<ErrorCardProps> = ({
  userAnswer,
  setStatus,
  prevquestion,
  speakAnswer,
}) => {
    return (
      <div
        className="fixed inset-0 bg-red-200 flex flex-col justify-center align-center text-center"
        onClick={() => {
          setStatus("active");
        } }
      >
        
        <p className="mt-2 text-lg">
          <strong>{prevquestion}</strong>
        </p>
        <p className="mt-2 text-sm">
          <strong>You answered:</strong> 
        </p>
        <p  className="mt-2 text-lg">
        {userAnswer}
        </p>
        {/* Listen Button */}
        <button
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
