import { useMutation, useQueryClient } from "react-query";
import { dislikeReply, likeReply } from "@/queries/reaction.queries";
import { ReplyData } from "@/interfaces/reply.interface";
import toast from "react-hot-toast";

const useReplyReactions = (reply: ReplyData) => {
  const replyId = reply._id;
  const queryClient = useQueryClient();

  const { mutate: mutateLike } = useMutation({
    mutationFn: likeReply,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
        exact: true,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
      });

      const previousData: any = queryClient.getQueryData(
        reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }]
      );

      const newPages = previousData.pages.map((page: any) => {
        return {
          ...page,
          data: {
            data: page.data.data.map((reply: ReplyData) => {
              if (reply._id === replyId) {
                // Adjust the reaction and count for the liked reply

                return {
                  ...reply,
                  userReaction: reply.userReaction === "like" ? null : "like",
                  reactionCount:
                    reply.userReaction === "like"
                      ? reply.reactionCount - 1
                      : reply.reactionCount === -1
                      ? 1
                      : reply.reactionCount + 1,
                };
              }
              return reply;
            }),
            metadata: page.data.metadata,
          },
        };
      });

      const optimisticData = {
        ...previousData,
        pages: newPages,
      };

      queryClient.setQueryData(
        reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
        optimisticData
      );

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
        context?.previousData
      );
      toast.error("Error liking discussion", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const { mutate: mutateDislike } = useMutation({
    mutationFn: dislikeReply,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
        exact: true,
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
      });

      const previousData: any = queryClient.getQueryData(
        reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }]
      );

      const newPages = previousData.pages.map((page: any) => {
        return {
          ...page,
          data: {
            data: page.data.data.map((reply: any) => {
              if (reply._id === replyId) {
                // Adjust the reaction and count for the liked reply

                return {
                  ...reply,
                  userReaction: "dislike",
                  reactionCount:
                    reply.userReaction === "dislike"
                      ? reply.reactionCount + 1
                      : reply.reactionCount === 1
                      ? -1
                      : reply.reactionCount - 1,
                };
              }
              return reply;
            }),
            metadata: page.data.metadata,
          },
        };
      });

      const optimisticData = {
        ...previousData,
        pages: newPages,
      };

      queryClient.setQueryData(
        reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
        optimisticData
      );

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
        context?.previousData
      );
      toast.error("Error disliking discussion", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  return { mutateLike, mutateDislike };
};

export default useReplyReactions;
