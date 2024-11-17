import { Reply } from "@/interfaces/reply.interface";
import mongoose, { Model, Schema } from "mongoose";

const replySchema: Schema<Reply> = new Schema<Reply>(
  {
    discussionId: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
    },
    replyId: {
      type: Schema.Types.ObjectId,
      ref: "Reply",
    },
    repliedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    dislikes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    status: {
      type: String,
      default: "posted",
    },
  },
  { timestamps: true }
);

export const ReplyModel =
  (mongoose.models.Reply as Model<Reply>) ||
  mongoose.model<Reply>("Reply", replySchema);
