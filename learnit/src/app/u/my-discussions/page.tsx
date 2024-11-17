"use client";

import BackButton from "@/components/BackButton";
import DiscussionCard from "@/components/DiscussionCard";
import DiscussionCardSkeleton from "@/components/DiscussionCardSkeleton";
import LoadMoreButton from "@/components/LoadMoreButton";
import SummaryCard from "@/components/SummaryCard";
import { DiscussionCardData } from "@/interfaces/discussion.interface";
import { Summary } from "@/interfaces/summary.interface";
import { getAllSummaries } from "@/queries/summary.queries";
import { getDiscussionsByCurrentUser } from "@/queries/user.queries";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useDebounce } from "use-debounce";

const MyDiscussions = () => {
  const [filter, setFilter] = useState<string>("");
  const [debouncedFilter] = useDebounce(filter, 350);

  const {
    isLoading: isDiscussionLoading,
    isError: isDiscussionError,
    data: discussions,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-discussions", { pageSize: 10, filter: debouncedFilter }],
    queryFn: ({ pageParam }) =>
      getDiscussionsByCurrentUser({
        pageParam,
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
        <h1 className="text-base-content text-xl font-medium">
          Your Discussions
        </h1>
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
      {discussions?.pages[0].data.data.length === 0 &&
        debouncedFilter === "" && (
          <div className="mt-4">
            <div className="flex flex-col items-center gap-2 mt-12 md:mt-20">
              <p className="text-center text-base-content text-lg font-medium">
                You havent&apos;t created any discussions yet
              </p>
            </div>
          </div>
        )}
      <div className="mt-4 md:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isDiscussionLoading && (
          <>
            <DiscussionCardSkeleton />
            <DiscussionCardSkeleton />
            <DiscussionCardSkeleton />
            <DiscussionCardSkeleton />
            <DiscussionCardSkeleton />
          </>
        )}
        {discussions?.pages.map((page) => {
          return page.data.data.map((discussion: DiscussionCardData) => {
            return (
              <DiscussionCard key={discussion._id} discussion={discussion} />
            );
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

export default MyDiscussions;
