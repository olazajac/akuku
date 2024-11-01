

interface CorrectCardProps {
  correctAnswer: string;
  setStatus: string;
  inputRef: React.RefObject<HTMLInputElement>;
  prevquestion: any;

}

const CorrectCard: React.FC<CorrectCardProps> = ({
  correctAnswer,
  setStatus,
  prevquestion,

}) => {
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

      <p className="mt-2">Press any key to continue to the next question.</p>
    </div>
  );
};

export default CorrectCard;
