import { Schema } from "mongoose";

export interface Reply {
  discussionId?: Schema.Types.ObjectId;
  replyId?: Schema.Types.ObjectId;
  repliedBy: Schema.Types.ObjectId;
  content: string;
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
  status: "posted" | "deleted" | "edited";
}

export type ReplyData = Pick<
  Reply,
  "content" | "likes" | "dislikes" | "discussionId" | "replyId" | "status"
> & {
  _id: string;
  repliedBy: {
    _id: string;
    displayName: string;
    profilePhoto: string;
    reputation: number;
  };
  replyCount: number;
  createdAt: Date;
  updatedAt: Date;
  userReaction: string;
  reactionCount: number;
};
