import { Summary } from "@/interfaces/summary.interface";
import mongoose, { Model, Schema } from "mongoose";

const summarySchema = new Schema<Summary>(
  {
    content: {
      type: String,
      required: true,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notebook: {
      type: Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
    },
  },
  { timestamps: true }
);

export const SummaryModel =
  (mongoose.models.Summary as Model<Summary>) ||
  mongoose.model<Summary>("Summary", summarySchema);
