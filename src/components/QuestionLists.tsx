import React from "react";

type Question = {
  pytanie: string;
  odpowiedz: string;
  hot: number;
  guessed: number;
  errors: number;
  index: number;
  
};

interface QuestionListsProps {
  shuffledQuestions: Question[];
  onSpeakAnswer: (text: string) => void;
  status: string;
}

const QuestionLists: React.FC<QuestionListsProps> = ({
  shuffledQuestions,
  onSpeakAnswer,
  status,
}) => {
  const guessedQuestions = shuffledQuestions.filter((q) => q.guessed === 1);
  const errorQuestions = shuffledQuestions.filter((q) => q.errors > 0);
  const unansweredQuestions = shuffledQuestions.filter(
    (q) => q.hot === 0 && q.guessed === 0
  );

  return (
    <div className="mt-4">


{status === 'intro' &&  <> 

      {unansweredQuestions.length  > 0 && <h3 className="text-center text-sm text-gray-400">Questions:</h3> }
      
      <ul className="flex flex-wrap mt-2 gap-4">
        {unansweredQuestions.map((q) => (
          <li
            key={q.index}
            className="p-4 w-full bg-emerald-500 align-middle justify-items-center rounded-md text-center text-white"
            onClick={(e) => {
              e.stopPropagation();
              onSpeakAnswer(q.odpowiedz);
            }}
          >
            {q.pytanie}
          </li>
        ))}
      </ul>

      </>}


      {status !== 'intro' &&  <> 


        {guessedQuestions.length  > 0 && <h3 className="text-center text-sm text-gray-400">Guessed Questions:</h3> }
      <ul className="flex flex-wrap mt-2 gap-4">
        {guessedQuestions.map((q) => (
          <li
            key={q.index}
            className="p-2 w-full border border-gray-200 bg-green-100 align-middle justify-items-center rounded-md text-center"
          >
            {q.pytanie}
          </li>
        ))}
      </ul>

      {errorQuestions.length  > 0 &&  <h3 className="text-center text-sm text-gray-400">Error Questions:</h3> }
      <ul className="flex flex-wrap mt-2 gap-4">
        {errorQuestions.map((q) => (
          <li
            key={q.index}
            className="p-2 w-full border border-gray-200 bg-red-100 align-middle justify-items-center rounded-md"
          >
            {q.pytanie}
            <div className="text-sm text-gray-600 mt-1">
              <p>Errors: {q.errors}</p>
            </div>
          </li>
        ))}
      </ul>
  
       </>}


     
    </div>
  );
};

export default QuestionLists;
