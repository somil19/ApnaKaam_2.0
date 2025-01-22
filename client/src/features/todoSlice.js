import { createSlice } from "@reduxjs/toolkit";
// createSlice and createReducer use a library called Immer to simplify the process of updating the Redux state in a way that feels like you're mutating the state directly, even though you're actually producing correct and immutable updates.

const initialState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    addTodo: (state, action) => {
      state.todos.push(action.payload); //pushing the todo in the todos array
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo._id !== action.payload);
    },
    // updateTodo: (state, action) => {
    //   const { id, ...updatedTodo } = action.payload;
    //   const index = state.todos.findIndex((todo) => todo.id === id);
    //   if (index !== -1) {
    //     state.todos = [
    //       ...state.todos.slice(0, index),
    //       { ...state.todos[index], ...updatedTodo },
    //       ...state.todos.slice(index + 1),
    //     ];
    //   }
    // },
    updateTodo: (state, action) => {
      const { id, ...updatedTodo } = action.payload;
      const index = state.todos.findIndex((todo) => todo._id === id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...updatedTodo };
      }
    },

    toggleTodo: (state, action) => {
      const todo = state.todos.find((todo) => todo._id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    clearTodos: (state) => {
      state.todos = [];
    },
  },
});
// Action creators are generated for each case reducer function
export const {
  setTodos,
  addTodo,
  removeTodo,
  updateTodo,
  toggleTodo,
  clearTodos,
} = todoSlice.actions;

export default todoSlice.reducer;
