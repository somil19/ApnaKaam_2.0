import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  userId: "",
  userName: "",
  signUpSuccess: false,
  avatar: { file: null, imgUrl: null },
  email: "",
  password: "",
  token: localStorage.getItem("token"),
};

export const signUpSlice = createSlice({
  name: "signUp",
  initialState: initialValue,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserAvatar: (state, action) => {
      // console.log("avatar updated");
      state.avatar = action.payload;
    },
    setUserName: (state, action) => {
      // console.log("username updated");
      state.userName = action.payload;
    },
    setUserEmail: (state, action) => {
      // console.log("email updated");
      state.email = action.payload;
    },
    setUserPassword: (state, action) => {
      // console.log("password updated");
      state.password = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    signUpSuccess: (state, action) => {
      state.signUpSuccess = action.payload;
    },
    logOut: (state) => {
      Object.assign(state, initialValue);
      state.token = "";
      localStorage.removeItem("token");
    },
  },
});

export const {
  setUserId,
  setUserAvatar,
  setUserName,
  signUpSuccess,
  setToken,
  logOut,
  setUserEmail,
  setUserPassword,
} = signUpSlice.actions;

export default signUpSlice.reducer;
