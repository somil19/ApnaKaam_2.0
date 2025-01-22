import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user
  day: {
    type: String,
    enum: ["today", "tomorrow", "upcoming"],
    required: true,
  },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  reminder: { type: Date, default: null },
  priority: { type: Boolean, default: false },
  notes: { type: String, default: "" },
  category: {
    type: String,
    enum: ["work", "personal", "grocery"],
    required: true,
  },
  todoAddedAt: { type: String },
  todoUpdatedAt: { type: String },
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
