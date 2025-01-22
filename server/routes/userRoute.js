import express from "express";
import {
  registerUser,
  loginUser,
  userDetails,
  updateAvatar,
  scheduleEmail,
  sendResetOtp,
  resetPassword,
  welcomeEmail,
  updatUserName,
} from "../controllers/userController.js";

import multer from "multer";
import "dotenv/config";
import userAuth from "../middlewares/auth.js";

// import userAuth from "../middleware/auth.js";
const userRouter = express.Router();

// Set up Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });
// Create a user
userRouter.post("/register", upload.single("avatar"), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/userDetails", userAuth, userDetails);
userRouter.post(
  "/updateAvatar",
  upload.single("avatar"),
  userAuth,
  updateAvatar
);
userRouter.post("/update-name", userAuth, updatUserName);
userRouter.post("/schedule-email", scheduleEmail);
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/welcome-email", welcomeEmail);
export default userRouter;
