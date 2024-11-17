"use client";

import BackButton from "@/components/BackButton";
import LoadMoreButton from "@/components/LoadMoreButton";
import SummaryCard from "@/components/SummaryCard";
import { Summary } from "@/interfaces/summary.interface";
import { getAllSummaries } from "@/queries/summary.queries";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useDebounce } from "use-debounce";

const AllSummaries = ({ params }: { params: { id: string } }) => {
  const notebookId = params.id;

  const [filter, setFilter] = useState<string>("");
  const [debouncedFilter] = useDebounce(filter, 350);

  const {
    isLoading,
    isRefetching,
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

  return (
    <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 w-full flex flex-col bg-base-200">
      <div className="flex gap-3 items-center">
        <BackButton />
        <h1 className="text-base-content text-xl font-medium">All Summaries</h1>
      </div>
      <div className="mt-4 md:mt-6">
        <label className="input input-bordered flex items-center gap-2 max-w-sm">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            type="text"
            className="grow text-base-content"
            placeholder="Search by title or tags"
          />
          <Search className="text-base-content w-5 h-5" />
        </label>
      </div>
      {(isLoading || isRefetching) && (
        <div className="mt-4 flex justify-center">
          <div className="loading loading-spinner loading-sm text-primary"></div>
        </div>
      )}
      <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {summaries?.pages.map((page) => {
          return page.data.data.map((summary: Summary & { _id: string }) => {
            return <SummaryCard key={summary._id} summary={summary} />;
          });
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
    </div>
  );
};

export default AllSummaries;
