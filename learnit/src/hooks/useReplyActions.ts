import { useMutation, useQueryClient } from "react-query";
import { addReply, deleteReply } from "@/queries/replies.queries";
import toast from "react-hot-toast";
import { ReplyData } from "@/interfaces/reply.interface";
import { Dispatch, SetStateAction } from "react";

const useReplyActions = (
  reply: ReplyData,
  setReplyContent: Dispatch<SetStateAction<string>>,
  setReplyInputVisible: Dispatch<SetStateAction<boolean>>,
  setReplySection: Dispatch<SetStateAction<boolean>>
) => {
  const replyId = reply._id;
  const queryClient = useQueryClient();

  const { mutate: mutateAdd, isLoading: isReplyLoading } = useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", { replyId }],
        exact: true,
      });
      setReplyContent("");
      setReplyInputVisible(false);
      setReplySection(true);
    },
    onError: () => {
      toast.error("Error sending reply", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const { mutate: mutateDelete, isLoading: isDeleting } = useMutation({
    mutationFn: deleteReply,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
        exact: true,
      });
    },
    onError: () => {
      toast.error("Error deleting reply", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  return { mutateAdd, mutateDelete, isReplyLoading, isDeleting };
};

export default useReplyActions;
