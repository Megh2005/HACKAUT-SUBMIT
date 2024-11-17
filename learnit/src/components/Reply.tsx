import { ReplyData } from "@/interfaces/reply.interface";
import { convertDateTime } from "@/utils/convertDateTime";
import {
  MessageCircle,
  Pencil,
  ReplyIcon,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReplyInput from "./ReplyInput";
import RepliesToReply from "./RepliesToReply";
import ReplyEdit from "./ReplyEdit";
import useReplyReactions from "@/hooks/useReplyReactions";
import useReplyActions from "@/hooks/useReplyActions";
import ReplyDeleteModal from "./ReplyDeleteModal";
import { useSession } from "next-auth/react";

const Reply = ({ reply }: { reply: ReplyData }) => {
  const replyId = reply._id;
  const userId = useSession().data?.user?._id;

  const [replyInputVisible, setReplyInputVisible] = useState<boolean>(false);
  const [replyEditVisible, setReplyEditVisible] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [replySection, setReplySection] = useState<boolean>(false);
  const [replyCount, setReplyCount] = useState(reply.replyCount);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const { mutateAdd, isReplyLoading, mutateDelete, isDeleting } =
    useReplyActions(
      reply,
      setReplyContent,
      setReplyInputVisible,
      setReplySection
    );
  const { mutateLike, mutateDislike } = useReplyReactions(reply);

  const handleLike = () => {
    mutateLike(replyId);
  };

  const handleDislike = () => {
    mutateDislike(replyId);
  };

  const handleDeleteReply = async () => {
    mutateDelete({ replyId });
  };

  const sendReply = async () => {
    if (!replyContent.trim()) return;
    mutateAdd({ replyId, content: replyContent });
  };

  return (
    <div>
      <div className="py-2 min-w-[250px]">
        <div className="flex justify-between gap-2 items-center">
          <div className="flex gap-3 items-center">
            {reply.repliedBy.profilePhoto ? (
              <div className="avatar">
                <div className="ring-base-content ring-offset-base-100 ring-1 ring-offset-2 w-4 sm:w-6 rounded-full">
                  <Image
                    src={reply.repliedBy.profilePhoto}
                    alt="avatar"
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="ring-base-content ring-offset-base-100 ring-1 ring-offset-2 bg-neutral text-neutral-content w-4 sm:w-6 rounded-full">
                  <span className="text-xs">
                    {reply.repliedBy.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            )}
            <span className="text-base-content text-sm font-bold">
              {reply.repliedBy.displayName}
            </span>
            {reply.status === "edited" && (
              <span className="text-base-content/85 text-xs">(edited)</span>
            )}
          </div>
          <span className="text-xs text-base-content/80">
            {convertDateTime(reply.createdAt.toString())}
          </span>
        </div>
        <div className="mt-2">
          <p
            className={`${
              reply.status === "deleted"
                ? "text-base-content/85 line-through"
                : "text-base-content"
            }`}
          >
            {reply.content}
          </p>
        </div>
        <div className="flex justify-between mt-4 items-center">
          <div className="flex gap-4 items-center">
            {reply.status !== "deleted" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-base-content">
                    {reply.reactionCount}
                  </span>
                  <ThumbsUp
                    onClick={handleLike}
                    className={`hover:text-primary cursor-pointer ${
                      reply.userReaction === "like"
                        ? "text-primary"
                        : "text-base-content"
                    } w-4 h-4 sm:w-5 sm:h-5`}
                  />
                  <ThumbsDown
                    onClick={handleDislike}
                    className={`hover:text-red-400 cursor-pointer ${
                      reply.userReaction === "dislike"
                        ? "text-error"
                        : "text-base-content"
                    } w-4 h-4 sm:w-5 sm:h-5`}
                  />
                </div>
                <ReplyIcon
                  onClick={() => {
                    setReplyInputVisible(!replyInputVisible);
                    if (replyEditVisible) setReplyEditVisible(false);
                  }}
                  className="hover:text-primary cursor-pointer text-base-content w-4 h-4 sm:w-5 sm:h-5"
                />
              </>
            )}
            <div className="flex gap-1 items-center">
              <span className="text-sm text-base-content">{replyCount}</span>
              <MessageCircle
                onClick={() => setReplySection(!replySection)}
                className="hover:text-primary cursor-pointer text-base-content w-4 h-4 sm:w-5 sm:h-5"
              />
            </div>
          </div>
          {reply.status !== "deleted" && reply.repliedBy._id === userId && (
            <div className="flex gap-3 items-center">
              <Pencil
                onClick={() => {
                  setReplyEditVisible(!replyEditVisible);
                  if (replyInputVisible) setReplyInputVisible(false);
                }}
                className="hover:text-primary cursor-pointer text-base-content w-4 h-4 sm:w-5 sm:h-5"
              />
              <div className="relative">
                {deleteModalVisible && (
                  <ReplyDeleteModal
                    isDeleting={isDeleting}
                    handleDeleteReply={handleDeleteReply}
                    setDeleteModalVisible={setDeleteModalVisible}
                  />
                )}
                <Trash2
                  onClick={() => setDeleteModalVisible(true)}
                  className="hover:text-red-400 cursor-pointer text-base-content w-4 h-4 sm:w-5 sm:h-5"
                />
              </div>
            </div>
          )}
        </div>
        {!replyInputVisible &&
          replyEditVisible &&
          reply.status !== "deleted" && (
            <ReplyEdit
              setReplyEditVisible={setReplyEditVisible}
              reply={reply}
            />
          )}
        {replyInputVisible &&
          !replyEditVisible &&
          reply.status !== "deleted" && (
            <div className="mt-2">
              <ReplyInput
                isReplyLoading={isReplyLoading}
                onClickAction={sendReply}
                stateValue={replyContent}
                stateAction={setReplyContent}
                size="sm"
                placeholder="Reply to this comment"
              />
            </div>
          )}
      </div>
      {replySection && (
        <RepliesToReply replyId={replyId} action={setReplyCount} />
      )}
    </div>
  );
};

export default Reply;
