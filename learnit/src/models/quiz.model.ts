import { Quiz } from "@/interfaces/quiz.interface";
import mongoose, { Model, Schema } from "mongoose";

const quizSchema = new Schema<Quiz>(
  {
    questions: {
      type: [],
      required: true,
    },
    userAnswers: {
      type: {},
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
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const QuizModel =
  (mongoose.models.Quiz as Model<Quiz>) ||
  mongoose.model<Quiz>("Quiz", quizSchema);
