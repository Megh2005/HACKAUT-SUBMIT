"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const QuizQuestion = ({ question }: { question: any }) => {
  const { register, watch } = useFormContext();

  // Watch the value of the current question's selected option
  const selectedAnswer = watch(`answer-${question?.id}`);

  return (
    <div>
      <div>
        <p className="text-base-content text-lg font-bold my-4">
          {question?.question}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {question?.answers?.map((answer: string, index: number) => (
          <div key={index} className="flex gap-2">
            <input
              {...register(`answer-${question?.id}`)}
              type="radio"
              value={index}
              className="radio radio-primary"
              id={`option-${question?.id}-${index}`}
              checked={selectedAnswer === index.toString()}
            />
            <label
              className="text-base-content text"
              htmlFor={`option-${question?.id}-${index}`}
            >
              {answer}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
