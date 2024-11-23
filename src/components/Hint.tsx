import React from 'react'

interface QuestionCardProps {
    correctAnswer?: string;
  }

const Hint: React.FC<QuestionCardProps> = ({
correctAnswer,

}) => {
  return (
    <div>
        <p>{correctAnswer}</p>
    </div>
  )
}

export default Hint
