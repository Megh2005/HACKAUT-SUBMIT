import { Quiz } from "@/interfaces/quiz.interface";
import { ArrowLeft } from "lucide-react";
import React from "react";
import DeleteQuizModal from "./DeleteQuizModal";

const QuizCard = ({ quiz }: { quiz: Quiz & { _id: string } }) => {
  return (
    <div>
      <div className="flex mb-2 justify-end">
        <DeleteQuizModal quiz={quiz} />
      </div>
      <div
        onClick={() =>
          (
            document.getElementById(`${quiz._id}`)! as HTMLDialogElement
          ).showModal()
        }
        className="cursor-pointer card shadow-md dark:shadow-2xl bg-white/50 dark:bg-neutral/55 text-primary-content max-w-md rounded-md"
      >
        <div className="card-body">
          <h2 className="text-base-content card-title font-bold line-clamp-2">
            {quiz.title}
          </h2>
        </div>
        <dialog id={`${quiz._id}`} className="modal">
          <div className="modal-box max-w-4xl cursor-default">
            <form className="my-2" method="dialog">
              <button>
                <ArrowLeft className="w-6 h-6 text-primary" />
              </button>
            </form>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-base-content">
              Quiz Summary
            </h1>
            <div>
              {quiz?.questions?.map((question, index) => {
                return (
                  <div
                    key={index}
                    className="border-b border-base-content pb-2"
                  >
                    <div>
                      <p className="text-base-content text-lg font-bold my-4">
                        {question?.question}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {question?.answers?.map(
                        (answer: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <input
                              readOnly
                              type="radio"
                              value={index}
                              className="radio radio-primary"
                              id={`option-${question?.id}-${index}`}
                              checked={
                                quiz.userAnswers[`answer-${question?.id}`] ===
                                index.toString()
                              }
                            />
                            <label
                              className="text-base-content text"
                              htmlFor={`option-${question?.id}-${index}`}
                            >
                              {answer}
                            </label>
                          </div>
                        )
                      )}
                      <div className="mt-2 text-base-content">
                        <p className="font-bold">
                          <span className="text-green-600 dark:text-green-500">
                            Correct Answer
                          </span>
                          :{" "}
                          <span className="ml-1">
                            {question?.correctAnswer + 1}
                          </span>
                        </p>
                        <p className="font-bold text-base-content">
                          <span className="text-primary ">Your Answer</span>:
                          <span className="ml-1">
                            {quiz.userAnswers[`answer-${question?.id}`]
                              ? parseInt(
                                  quiz.userAnswers[`answer-${question?.id}`]!
                                ) + 1
                              : "Not Answered"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default QuizCard;
