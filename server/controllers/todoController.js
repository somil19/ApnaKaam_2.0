import Todo from "../models/todoModel.js";

import "dotenv/config";

export const addTodo = async (req, res) => {
  try {
    const {
      title,
      day,
      completed,
      category,
      priority,
      notes,
      reminder,
      userId,
      todoAddedAt,
    } = req.body;

    const todoData = {
      userId,
      day,
      title,
      completed: completed || false,
      reminder: reminder || null,
      priority: priority || false,
      notes: notes || "",
      category,
      todoAddedAt,
    };

    // Create and save the todo
    const newTodo = new Todo(todoData);
    await newTodo.save();

    res.status(200).json({
      success: true,
      todo: newTodo,
      message: "Todo added successfully",
    });
  } catch (error) {
    
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeTodo = async (req, res) => {
  try {
    const { todoId } = req.params; // Get todoId from URL params
    const { userId } = req.body;

    if (!todoId) {
      return res.status(400).json({
        success: false,
        message: "Todo ID is required.",
      });
    }

    // Find the todo and ensure it belongs to the user
    const todo = await Todo.findOne({ _id: todoId, userId });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or not authorized to delete.",
      });
    }

    await Todo.deleteOne({ _id: todoId, userId });

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting todo: " + error.message,
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params; 
    const { title, category, priority, notes, reminder, todoUpdatedAt } = req.body;

    if (!todoId) {
      return res.status(400).json({
        success: false,
        message: "Todo ID is required.",
      });
    }

    // Find the todo and ensure it belongs to the user
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId },
      {
        title,
        category,
        priority,
        notes,
        reminder,
        todoUpdatedAt,
      },
      { new: true }
    );
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or not authorized to update.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully.",
      todo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating todo: " + error.message,
    });
  }
};

export const getTodos = async (req, res) => {
  try {
    const { day } = req.params;
    const userId = req.body?.userId;

    if (!day || !userId) {
      return res.status(400).json({
        success: false,
        message: "Day and user ID are required.",
      });
    }

    const todos = await Todo.find({ day, userId });
    res.status(200).json({ success: true, todos });
  } catch (error) {
    
    res.status(500).json({
      success: false,
      message: "Error fetching todos: " + error.message,
    });
  }
};

export const handleCompleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params; 
    const todo = await Todo.findOne({ _id: todoId });
    todo.completed = !todo.completed;
    await todo.save();
    return res.status(200).json({ success: true, message: "Todo updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error completing todo: " + error.message,
    });
  }
};
