import { Schema } from "mongoose";

export interface Summary {
  content: string;
  notebook: Schema.Types.ObjectId;
  generatedBy: Schema.Types.ObjectId;
}
