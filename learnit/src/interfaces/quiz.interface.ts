import { Schema } from "mongoose";

export interface QuizQuestion {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
  userAnswers: {
    [key: string]: string | null;
  };
  notebook: Schema.Types.ObjectId;
  generatedBy: Schema.Types.ObjectId;
}
