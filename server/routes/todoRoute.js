import express from "express";
import {
  addTodo,
  removeTodo,
  updateTodo,
  getTodos,
  handleCompleteTodo,
} from "../controllers/todoController.js";
import userAuth from "../middlewares/auth.js";

const todoRouter = express.Router();

todoRouter.post("/addTodo", userAuth, addTodo);
todoRouter.delete("/removeTodo/:todoId", userAuth, removeTodo);
todoRouter.post("/updateTodo/:todoId", userAuth, updateTodo);
todoRouter.get("/getTodos/:day", userAuth, getTodos);
todoRouter.post("/handleCompleteTodo/:todoId", handleCompleteTodo);
export default todoRouter;
