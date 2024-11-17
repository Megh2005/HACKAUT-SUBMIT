"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import QuizQuestion from "./QuizQuestion";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  setCorrectAnswers,
  setIncorrectAnswers,
  setSubmitted,
  setUnanswered,
} from "@/lib/store/features/quiz.slice";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

const QuizMain = ({ notebookId }: { notebookId: string }) => {
  const {
    quiz,
    quizTitle,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    submitted,
  } = useAppSelector((state) => state.quiz);
  const dispatcher = useAppDispatch();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const form = useForm({});
  const queryClient = useQueryClient();

  const onSubmit = async (data: any) => {
    setLoading(true);
    let correct_answers = 0;
    let incorrect_answers = 0;
    let unanswered = 0;

    Object.entries(data).map(([key, value], index) => {
      if (value === quiz[index]?.correctAnswer.toString()) {
        correct_answers++;
      } else if (
        value !== null &&
        value !== quiz[index]?.correctAnswer.toString()
      ) {
        incorrect_answers++;
      } else {
        unanswered++;
      }
    });

    try {
      const res = await axios.post("/api/quiz/save", {
        answers: data,
        questions: quiz,
        notebook: notebookId,
        title: quizTitle,
      });

      if (res.data.success) {
        dispatcher(setCorrectAnswers(correct_answers));
        dispatcher(setIncorrectAnswers(incorrect_answers));
        dispatcher(setUnanswered(unanswered));
        dispatcher(setSubmitted(true));

        queryClient.invalidateQueries({
          queryKey: ["quizzes", { notebookId, pageSize: 4 }],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ["quizzes", { notebookId, pageSize: 10 }],
        });

        form.reset();
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      toast.error("Error saving quiz", {
        position: "top-center",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (quiz?.length === 0) {
    return (
      <p className="text-base-content/85 text-lg text-center">
        Generate a quiz to get started
      </p>
    );
  }

  return (
    <div className="card bg-white/50 dark:bg-neutral/55 w-full shadow-xl rounded-md">
      {!submitted && (
        <div className="card-body">
          <h2 className="card-title text-base-content">Generated Quiz</h2>
          <div className="flex justify-between mt-4 md:mt-6">
            <div>
              <button
                type="button"
                className="btn btn-primary btn-circle btn-sm bg-primary bg-opacity-10 hover:bg-opacity-0"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="text-primary w-5 h-5" />
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary btn-circle btn-sm bg-primary bg-opacity-10 hover:bg-opacity-0"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex >= quiz?.length - 1}
              >
                <ArrowRight className="text-primary w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                  <QuizQuestion question={quiz[currentQuestionIndex]} />
                </div>

                {currentQuestionIndex === quiz?.length - 1 && (
                  <button className="mt-4 btn btn-primary" type="submit">
                    {loading ? (
                      <span className="loading loading-spinner loading-sm sm:loading-md text-primary-content"></span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                )}
              </form>
            </FormProvider>
          </div>
        </div>
      )}
      {submitted && (
        <div className="card-body">
          <h2 className="card-title text-base-content">Results</h2>
          <div className="stats stats-vertical lg:stats-horizontal shadow max-w-2xl mt-4">
            <div className="stat flex flex-col items-center lg:items-start">
              <div className="stat-title dark:text-green-500 text-green-600 font-medium">
                Correct Answers
              </div>
              <div
                className="mt-4 radial-progress dark:text-green-500 text-green-600"
                style={
                  {
                    "--value": (correctAnswers / quiz?.length) * 100,
                    "--size": "6rem",
                    "--thickness": "4px",
                  } as React.CSSProperties
                }
                role="progressbar"
              >
                {correctAnswers} / {quiz?.length}
              </div>
            </div>

            <div className="stat flex flex-col items-center lg:items-start">
              <div className="stat-title text-error font-medium">
                Incorrect Answers
              </div>
              <div className="mt-4 stat-value text-error">
                {incorrectAnswers}
              </div>
            </div>
            <div className="stat flex flex-col items-center lg:items-start">
              <div className="stat-title text-base-content font-medium">
                Unanswered
              </div>
              <div className="mt-4 stat-value text-base-content">
                {unanswered}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizMain;
