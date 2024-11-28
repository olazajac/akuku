import { useState } from "react";

interface Question {
  pytanie: string;
  odpowiedz: string;
  hot: number;
  guessed: number;
  errors: number;
  index: number;
}

export const useQuestions = (initialQuestions: Question[]) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  const updateQuestionStatus = (index: number, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.index === index ? { ...q, ...updates } : q))
    );
  };

  const getFilteredGuessedQuestions = () =>
    questions.filter((q) => q.guessed === 1);

  const getFilteredErrorQuestions = () =>
    questions.filter((q) => q.errors > 0);

  return {
    questions,
    setQuestions,
    updateQuestionStatus,
    getFilteredGuessedQuestions,
    getFilteredErrorQuestions,
  };
};
