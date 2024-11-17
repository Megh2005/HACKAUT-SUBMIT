import { configureStore } from "@reduxjs/toolkit";
import quizSlice from "./features/quiz.slice";
import userSlice from "./features/user.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      quiz: quizSlice,
      user: userSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
