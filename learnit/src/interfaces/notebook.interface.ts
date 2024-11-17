import { Schema } from "mongoose";

export interface Notebook {
  name: string;
  createdBy: Schema.Types.ObjectId;
}

export interface NotebookData {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}
