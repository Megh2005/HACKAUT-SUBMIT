import { Notebook } from "@/interfaces/notebook.interface";
import { User } from "@/interfaces/user.interface";
import mongoose, { Model, Schema } from "mongoose";

const notebookSchema = new Schema<Notebook>(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const NoteBookModel =
  (mongoose.models.Notebook as Model<Notebook>) ||
  mongoose.model<Notebook>("Notebook", notebookSchema);
