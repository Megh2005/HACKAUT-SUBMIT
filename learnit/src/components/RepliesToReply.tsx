import { getReplies } from "@/queries/replies.queries";
import { useInfiniteQuery } from "react-query";
import Reply from "./Reply";
import { ReplyData } from "@/interfaces/reply.interface";
import { useEffect } from "react";
import LoadMoreButton from "./LoadMoreButton";

const RepliesToReply = ({
  replyId,
  action,
}: {
  replyId: string;
  action: any;
}) => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    data: replies,
  } = useInfiniteQuery({
    queryKey: ["replies", { replyId }],
    queryFn: ({ pageParam }) => getReplies({ pageParam, replyId }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.metadata.hasNextPage) {
        return lastPage.data.metadata.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    action(replies?.pages[0].data.metadata.totalCount);
  }, [replies]);

  if (isLoading)
    return (
      <div className="mt-4 flex justify-center">
        <div className="loading loading-spinner loading-sm text-primary"></div>
      </div>
    );

  if (isError)
    return (
      <div className="mt-4 flex justify-center">
        <p className="text-base-content text-sm">Error fetching replies</p>
      </div>
    );

  if (replies?.pages[0]?.data?.data?.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex flex-col mt-4">
        {replies?.pages.map((group, i) => {
          return group.data.data.map((reply: ReplyData) => (
            <div
              className=" overflow-x-auto py-1 ml-6 pl-4 border-l-2 border-base-content/35"
              key={reply._id}
            >
              <Reply reply={reply} />
            </div>
          ));
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

export default RepliesToReply;
