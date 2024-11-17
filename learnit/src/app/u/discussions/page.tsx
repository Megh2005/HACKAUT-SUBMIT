"use client";

import DiscussionCard from "@/components/DiscussionCard";
import DiscussionCardSkeleton from "@/components/DiscussionCardSkeleton";
import StyledButton from "@/components/StyledButton";
import { DiscussionCardData } from "@/interfaces/discussion.interface";
import { getAllDiscussions } from "@/queries/discussion.queries";
import { Frown, MoveRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { useDebounce } from "use-debounce";

const Discussions = () => {
  const [filter, setFilter] = useState<string>("");
  const [debouncedFilter] = useDebounce(filter, 350);

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    status,
    data: discussions,
  } = useInfiniteQuery({
    queryKey: ["discussions", { debouncedFilter }],
    queryFn: ({ pageParam }) =>
      getAllDiscussions({ pageParam, filter: debouncedFilter }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.metadata.hasNextPage) {
        return lastPage.data.metadata.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="flex-1 px-4 md:px-6 md:pl-28 py-8 w-full flex flex-col bg-base-200">
      <h1 className="text-xl md:text-2xl text-base-content font-bold tracking-tight">
        Discussion Board
      </h1>
      <div className="mt-4">
        <label className="input input-bordered flex items-center gap-2 max-w-sm">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            type="text"
            className="grow text-base-content"
            placeholder="Search by title or tags"
          />
          <Search className="w-5 h-5 text-base-content" />
        </label>
        <div className="mt-6 flex justify-start">
          <Link href="/u/ask">
            <StyledButton content="Start a discussion" />
          </Link>
        </div>
      </div>
      <div className="mt-4">
        {discussions?.pages[0].data.data.length === 0 && (
          <div className="flex flex-col items-center gap-2 mt-12 md:mt-20">
            <Frown className="text-base-content h-5 w-5 md:w-6 md:h-6" />
            <p className="text-center text-base-content text-lg font-medium">
              No discussions found
            </p>
          </div>
        )}
        <div className="mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {isLoading && (
            <>
              <DiscussionCardSkeleton />
              <DiscussionCardSkeleton />
              <DiscussionCardSkeleton />
              <DiscussionCardSkeleton />
              <DiscussionCardSkeleton />
            </>
          )}
          {discussions?.pages.map((group, i) => {
            return group.data.data.map((discussion: DiscussionCardData) => (
              <DiscussionCard key={discussion._id} discussion={discussion} />
            ));
          })}
        </div>
      </div>
    </div>
  );
};

export default Discussions;
