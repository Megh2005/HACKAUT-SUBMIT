"use client";

import { RotateCcw } from "lucide-react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import Reply from "./Reply";
import { ReplyData } from "@/interfaces/reply.interface";
import { addReply, getReplies } from "@/queries/replies.queries";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import ReplyInput from "./ReplyInput";
import LoadMoreButton from "./LoadMoreButton";

const RepliesSection = ({ discussionId }: { discussionId: string }) => {
  const [content, setContent] = useState<string>("");

  const queryClient = useQueryClient();

  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    data: replies,
  } = useInfiniteQuery({
    queryKey: ["replies", { discussionId }],
    queryFn: ({ pageParam }) => getReplies({ pageParam, discussionId }),
    getNextPageParam: (lastPage) => {
      if (lastPage.data.metadata.hasNextPage) {
        return lastPage.data.metadata.page + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { mutate, isLoading: isReplyLoading } = useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", { discussionId }],
        exact: true,
      });
      setContent("");
    },
    onError: () => {
      toast.error("Error sending reply", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const sendReply = async () => {
    if (!content.trim()) return;
    mutate({ discussionId, content });
  };

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

  return (
    <>
      <ReplyInput
        isReplyLoading={isReplyLoading}
        onClickAction={sendReply}
        stateValue={content}
        stateAction={setContent}
      />
      <h1 className="border-t border-base-content/35 mt-4 mb-6 pt-2 text-xl text-primary font-medium">
        <span>{replies?.pages[0].data.metadata.totalCount}</span> Replies
      </h1>
      <div className="flex flex-col gap-4 mt-4">
        {replies?.pages.map((group, i) => {
          return group.data.data.map((reply: ReplyData) => (
            <Reply key={reply._id} reply={reply} />
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
    </>
  );
};

export default RepliesSection;
