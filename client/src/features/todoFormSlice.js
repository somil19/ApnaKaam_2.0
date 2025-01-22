import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  isOpen: false,
  isUpdateForm: false,

  todoTitle: "",

  backendUrl: import.meta.env.VITE_API_URL || "http://localhost:5000",
};

const todoFormSlice = createSlice({
  name: "todoForm",
  initialState: initialValue,
  reducers: {
    setFormState: (state, action) => {
      state.isOpen = action.payload; // true for open, false for close
    },
    setUpdateFormState: (state, action) => {
      state.isUpdateForm = action.payload; // true for open, false for close
    },

    setTodoTitle: (state, action) => {
      state.todoTitle = action.payload; // set todo title
    },
  },
});
export const {
  setFormState,
  setUpdateFormState,

  setTodoTitle,
} = todoFormSlice.actions;
export default todoFormSlice.reducer;
