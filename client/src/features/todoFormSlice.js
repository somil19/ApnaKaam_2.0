import { createSlice } from "@reduxjs/toolkit";

// const initialValue = {
//   isOpen: false,
//   isClosed: false,
//   isUpdateForm: false,
//   showNotification: false,
//   todoTitle: "",
//   notificationTime: "",
// };

// const todoFormSlice = createSlice({
//   name: "todoForm",
//   initialState: initialValue,
//   reducers: {
//     openForm: (state) => {
//       state.isOpen = true;
//     },
//     closeForm: (state) => {
//       state.isOpen = false;
//     },
//     closeUpdateForm: (state) => {
//       state.isUpdateForm = !state.isUpdateForm;
//     },
//     setNotification: (state) => {
//       state.showNotification = !state.showNotification;
//     },
//     setTodoTitle: (state, action) => {
//       state.todoTitle = action.payload;
//     },
//     setNotificationTime: (state, action) => {
//       state.notificationTime = action.payload;
//     },
//   },
// });
const initialValue = {
  isOpen: false,
  isUpdateForm: false,
  showNotification: false,
  todoTitle: "",
  notificationTime: "",
  backendUrl: "http://localhost:5000",
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
    setNotificationState: (state, action) => {
      state.showNotification = action.payload; // true for show, false for hide
    },
    setTodoTitle: (state, action) => {
      state.todoTitle = action.payload; // set todo title
    },
    setNotificationTime: (state, action) => {
      state.notificationTime = action.payload; // set notification time
    },
  },
});
export const {
  setFormState,
  setUpdateFormState,
  setNotificationState,
  setTodoTitle,
  setNotificationTime,
} = todoFormSlice.actions;
export default todoFormSlice.reducer;
