import { Schema } from "mongoose";
import { User } from "./user.interface";

export interface Discussion {
  title: string;
  description: string;
  tags: string[];
  askedBy: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  dislikes: Schema.Types.ObjectId[];
  attachment?: string | null;
}

export type DiscussionData = Pick<
  Discussion,
  "title" | "description" | "tags" | "attachment"
> & {
  askedBy: User;
  createdAt: Date;
  updatedAt: Date;
};

export type DiscussionCardData = Pick<
  Discussion,
  "title" | "description" | "tags"
> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  askedBy: {
    _id: string;
    displayName: string;
    profilePhoto: string;
  };
};
