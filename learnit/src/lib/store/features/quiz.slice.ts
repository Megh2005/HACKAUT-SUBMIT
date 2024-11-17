import { QuizQuestion } from "@/interfaces/quiz.interface";
import { createSlice } from "@reduxjs/toolkit";

const quizSlice = createSlice({
  name: "quiz",
  initialState: {
    quiz: [] as QuizQuestion[],
    quizTitle: "",
    submitted: false,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unanswered: 0,
  },
  reducers: {
    setQuiz: (state, action) => {
      state.quiz = action.payload;
    },
    setQuizTitle: (state, action) => {
      state.quizTitle = action.payload;
    },
    removeQuiz: (state) => {
      state.quiz = [];
    },
    setSubmitted: (state, action) => {
      state.submitted = action.payload;
    },
    setCorrectAnswers: (state, action) => {
      state.correctAnswers = action.payload;
    },
    setIncorrectAnswers: (state, action) => {
      state.incorrectAnswers = action.payload;
    },
    setUnanswered: (state, action) => {
      state.unanswered = action.payload;
    },
  },
});

export const {
  setQuiz,
  setQuizTitle,
  removeQuiz,
  setSubmitted,
  setCorrectAnswers,
  setIncorrectAnswers,
  setUnanswered,
} = quizSlice.actions;
export default quizSlice.reducer;
