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
  // const guessedQuestions = shuffledQuestions.filter((q) => q.guessed === 1);
  // const errorQuestions = shuffledQuestions.filter((q) => q.errors > 0);
  const unansweredQuestions = shuffledQuestions.filter(
    (q) => q.hot === 0 && q.guessed === 0
  );

  return (
    <>


{status === 'intro' &&  <> 

      
      <ul className="flex flex-col mt-2 gap-4 p-3 text-emerald-900 max-w-[400px] align-middle justify-items-center m-auto">
        {unansweredQuestions.map((q) => (
          <li
            key={q.index}
            className="p-4 bg-gray-200 align-middle justify-items-center rounded-md text-center"
            onClick={(e) => {
              e.stopPropagation();
              onSpeakAnswer(q.odpowiedz);
            }}
          >
            {q.pytanie} 
            <p> {q.odpowiedz} </p> 
          </li>
        ))}
      </ul>

      </>}


  


     
    </>
  );
};

export default QuestionLists;
