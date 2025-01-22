import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./features/todoSlice";
import signUpReducer from "./features/signUpSlice";
import todoFormReducer from "./features/todoFormSlice";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    signUp: signUpReducer,
    todoForm: todoFormReducer,
  },
});
