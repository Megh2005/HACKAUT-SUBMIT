import { Discussion } from "@/interfaces/discussion.interface";
import mongoose, { Model, Schema } from "mongoose";

const discussionSchema: Schema<Discussion> = new Schema<Discussion>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 150,
      minlength: 10,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (tags: string[]) => tags.length >= 1 && tags.length <= 3,
        message: "You need to add at least 1 tag and at most 3 tags",
      },
    },
    askedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    attachment: {
      type: String,
    },
  },
  { timestamps: true }
);

export const DiscussionModel =
  (mongoose.models.Discussion as Model<Discussion>) ||
  mongoose.model<Discussion>("Discussion", discussionSchema);
