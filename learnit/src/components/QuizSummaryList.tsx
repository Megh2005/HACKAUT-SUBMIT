"use client";

import SummaryCheckbox from "@/components/SummaryCheckbox";
import { Summary } from "@/interfaces/summary.interface";
import { getAllSummaries } from "@/queries/summary.queries";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useDebounce } from "use-debounce";
import LoadMoreButton from "./LoadMoreButton";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  setCorrectAnswers,
  setIncorrectAnswers,
  setQuiz,
  setQuizTitle,
  setSubmitted,
  setUnanswered,
} from "@/lib/store/features/quiz.slice";

const QuizSummaryList = ({ notebookId }: { notebookId: string }) => {
  const [filter, setFilter] = useState<string>("");
  const [submit, setSubmit] = useState<boolean>(false);
  const [debouncedFilter] = useDebounce(filter, 350);

  const dispatch = useAppDispatch();

  const {
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isError,
    data: summaries,
  } = useInfiniteQuery({
    queryKey: ["summaries", { notebookId, pageSize: 10, debouncedFilter }],
    queryFn: ({ pageParam }) =>
      getAllSummaries({
        pageParam,
        notebookId,
        pageSize: 10,
        filter: debouncedFilter,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.metadata.hasNextPage) {
        return lastPage.data.metadata.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 10,
  });

  const form = useForm({});

  const { watch } = form;
  const values = watch();

  const checkboxValues = values.checkbox || {};

  const isSummarySelected = () => {
    return Object.keys(checkboxValues).some((key) => checkboxValues[key]);
  };

  const onSubmit = async () => {
    if (!isSummarySelected()) {
      return;
    }

    const selectedSummaries = Object.keys(checkboxValues).filter(
      (key) => checkboxValues[key]
    );

    const data = new FormData();

    selectedSummaries.map((summaryId) => {
      data.append("summary-id", summaryId);
    });

    try {
      setSubmit(true);
      const res = await axios.post("/api/quiz/generate", data);
      dispatch(setQuiz(res.data.data.questions));
      dispatch(setQuizTitle(res.data.data.title));
      dispatch(setCorrectAnswers(0));
      dispatch(setIncorrectAnswers(0));
      dispatch(setUnanswered(0));
      dispatch(setSubmitted(false));
    } catch (error) {
      console.log(error);
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div>
      <div>
        {isLoading && (
          <div className="mt-4 flex justify-center">
            <div className="loading loading-spinner loading-sm text-primary"></div>
          </div>
        )}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="max-h-[200px] overflow-y-auto pr-4 border-b border-base-content/55">
              {summaries?.pages.map((page) => {
                return page.data.data.map(
                  (summary: Summary & { _id: string; createdAt: Date }) => {
                    return <SummaryCheckbox key={summary._id} data={summary} />;
                  }
                );
              })}
            </div>
            <div className="mt-4 flex justify-center">
              {hasNextPage && !isFetchingNextPage ? (
                <LoadMoreButton clickHandler={fetchNextPage} />
              ) : null}
              {isFetchingNextPage && (
                <div className="loading loading-spinner loading-sm text-primary"></div>
              )}
            </div>
            <button
              disabled={isLoading || !isSummarySelected()}
              className="btn-primary btn font-medium dark:disabled:bg-neutral flex justify-center text-primary-content"
            >
              {submit ? (
                <span className="loading loading-spinner loading-sm sm:loading-md text-primary-content"></span>
              ) : (
                "Generate"
              )}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default QuizSummaryList;
