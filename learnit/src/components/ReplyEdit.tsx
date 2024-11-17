import { ReplyData } from "@/interfaces/reply.interface";
import { editReply } from "@/queries/replies.queries";
import { Send } from "lucide-react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

const ReplyEdit = ({
  reply,
  setReplyEditVisible,
}: {
  reply: ReplyData;
  setReplyEditVisible: any;
}) => {
  const editInput = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const { mutate: mutateEdit, isLoading } = useMutation({
    mutationFn: editReply,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reply.discussionId
          ? ["replies", { discussionId: reply.discussionId }]
          : ["replies", { replyId: reply.replyId }],
        exact: true,
      });
      setReplyEditVisible(false);
    },
    onError: () => {
      toast.error("Error updating reply", {
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const handleEditReply = async () => {
    if (!editInput.current?.value.trim()) return;
    mutateEdit({ content: editInput.current?.value, replyId: reply._id });
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <input
          ref={editInput}
          defaultValue={reply.content}
          type="text"
          placeholder="Edit your reply"
          className={`text-base-content input input-bordered w-full input-sm`}
        />
        <button
          onClick={handleEditReply}
          className="btn-sm md:btn-md btn btn-circle"
        >
          {isLoading ? (
            <div className="loading loading-spinner loading-sm text-primary"></div>
          ) : (
            <Send className="text-base-content w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ReplyEdit;
