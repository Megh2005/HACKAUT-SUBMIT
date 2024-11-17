import { User } from "@/interfaces/user.interface";
import mongoose, { Model, Schema } from "mongoose";

const userSchema = new Schema<User>(
  {
    displayName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    answeredQuestions: {
      type: [Schema.Types.ObjectId],
      ref: "Discussion",
      default: [],
    },
    askedQuestions: {
      type: [Schema.Types.ObjectId],
      ref: "Discussion",
      default: [],
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const UserModel =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", userSchema);
