import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
const PORT = process.env.PORT || 5000;
const app = express();
import userRouter from "./routes/userRoute.js";
import todoRouter from "./routes/todoRoute.js";

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

await connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
