import express from "express";
import cors from "cors";
import connectDB from "./config/mongodb.js";
const PORT = process.env.PORT || 5000;
const app = express();
import userRouter from "./routes/userRoute.js";
import todoRouter from "./routes/todoRoute.js";

app.use(
  cors({
    origin:
      "https://apna-kaam-2-0-tiar-2j3v0ewql-somil19s-projects.vercel.app/",
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/todo", todoRouter);

await connectDB();
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
