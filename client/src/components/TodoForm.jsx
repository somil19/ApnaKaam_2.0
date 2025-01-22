/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo } from "../features/todoSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faSquarePlus, faBell } from "@fortawesome/free-solid-svg-icons";
// import clockSound from "../assets/alarm-sound.mp3";
import cute from "../assets/cute.mp3";
// import { nanoid } from "@reduxjs/toolkit";
import { setFormState } from "../features/todoFormSlice";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// import { onMessageListener } from "../../firebase";
const alarmSound = new Audio(cute);

/* eslint-disable react/prop-types */

export default function TodoForm({ day }) {
  const [title, setTitle] = useState("");
  const [dueReminder, setDueReminder] = useState("");
  const [showRemBtn, setShowRemBtn] = useState(true);
  const [priority, setPriority] = useState(false);
  const [category, setCategory] = useState("work");
  const [notes, setNotes] = useState("");
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);
  const userEmail = useSelector((state) => state.signUp.email);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.signUp.token);
  const name = useSelector((state) => state.signUp.userName);

  async function handleAddTodo(e) {
    e.preventDefault();
    alarmSound.play();
    dueReminder && handleReminderSubmit();
    // Prepare the new todo data
    const newTodo = {
      title,
      day,
      completed: false,
      category,
      priority,
      notes,
      reminder: dueReminder,
      todoAddedAt: new Date().toLocaleString("en-US", {
        month: "short", // "Jan"
        day: "2-digit", // "16"
        year: "numeric", // "2025"
        hour: "2-digit", // "2"
        minute: "2-digit", // "30"
        hour12: true, // Use 12-hour format with AM/PM
      }),
    };

    // Send to backend
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/todo/addTodo`,
        newTodo,
        {
          headers: { token },
        }
      );

      console.log("Response from backend:", data);

      if (data.success) {
        const todoWithId = { ...newTodo, _id: data.todo._id }; // Add the generated id from the backend
        dispatch(addTodo(todoWithId)); // Dispatch only after getting the id
        toast.success("Todo added successfully");

        // Reset the form state
        dispatch(setFormState(false));
        setTitle("");
        setDueReminder("");
        setCategory("");
        setNotes("");
      } else {
        toast.error("Todo not added");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo");
    }
  }

  const handlePriority = () => {
    setPriority((priority) => !priority);
  };
  const handleReminderSubmit = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/schedule-email`, {
        toEmail: userEmail, // Replace with the user's email
        subject: `Reminder: ${title.toUpperCase()}`, // Email subject
        body: `
        Namaste ${name},
        
        This is a friendly reminder for your task:
        - Title: ${title.toUpperCase()}
        - Category: ${category}
        - Scheduled Time: ${new Date(dueReminder).toLocaleString()}
        
        Don't forget to complete your task on time!
        Stay productive and Have a great day😊   .
        
        Best regards, 
        Your ApnaKaam Team!
      `,
        sendTime: dueReminder, // Date & time set by the user
      });
    } catch (error) {
      toast.error("Error scheduling reminder: " + error.message);
      console.error("Error scheduling reminder:", error.message);
    }
  };
  return (
    <div
      className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex  items-center justify-center z-50 `}
    >
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-[90%] md:w-full space-y-4">
        <div className="flex items-center justify-between py-6">
          <h2 className="text-2xl font-bold text-gray-800">Add a new todo</h2>
          <FontAwesomeIcon
            icon={priority ? solidStar : regularStar}
            size="2x"
            onClick={handlePriority}
            style={{ color: "gold", cursor: "pointer" }}
          />
        </div>
        <div className="flex flex-col space-y-2 w-1/3">
          {" "}
          <span
            className={` text-center rounded-full border border-gray-300  px-2 py-2 text-sm font-semibold mx-2 `}
          >
            Tags
          </span>
          <div>
            {priority && <Tag text={"priority"} />}
            {category && <Tag text={`${category}`} />}
          </div>
        </div>
        <form onSubmit={handleAddTodo} className="space-y-4 ">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="I want to ..."
            />
          </div>
          <div className="flex items-center space-x-4">
            {showRemBtn ? (
              <button
                type="button"
                className="bg-red-400 text-black px-4 py-2 rounded-full hover:bg-red-300 w-full focus:ring-3 focus:ring-red-500"
                onClick={() => setShowRemBtn(false)}
              >
                Remind Me at..
                <FontAwesomeIcon
                  icon={faBell}
                  size="1x"
                  style={{ marginLeft: "5px", color: "purple" }}
                  shake={true}
                />
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                {/* Label */}
                <label htmlFor="category" className="text-gray-600 md:text-sm">
                  Add Date and Time
                </label>

                {/* Input Field */}

                <div className="flex items-center gap-3">
                  <input
                    type="datetime-local"
                    id="dueDate"
                    name="dueDate"
                    value={dueReminder || ""}
                    onChange={(e) => setDueReminder(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {/* Set Button */}
                  <button
                    onClick={() => {
                      toast.success("Reminder email scheduled successfully!");
                    }}
                    type="button"
                    className="md:px-2 md:py-1   md:bg-green-400 md:text-white md:rounded-3xl md:hover:bg-green-500 text-green-500 focus:outline-none  hover:scale-105 transition-all duration-500"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowRemBtn(true)}
                    className="md:bg-gray-200 md:px-2 md:py-1 md:rounded-3xl focus:outline-none  md:hover:bg-gray-300 hover:scale-125 transition-all duration-500"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="category" className="text-gray-600">
              Add Tags
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="grocery">Grocery List</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="notes" className="text-gray-600">
              Description
            </label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => dispatch(setFormState(false))}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FontAwesomeIcon
                icon={faSquarePlus}
                style={{ marginRight: "5px" }}
                size="2x"
              />
              Add Todo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Tag = ({ text }) => {
  let bgColor;
  switch (text) {
    case "priority":
      bgColor = "bg-yellow-400";
      break;
    case "personal":
      bgColor = "bg-red-400";
      break;
    case "work":
      bgColor = "bg-blue-400";
      break;
    case "grocery":
      bgColor = "bg-green-400";
      break;
  }
  return (
    <span
      className={`  rounded-full ${bgColor}  px-3 py-1 text-sm font-semibold mx-2 `}
    >
      {text}
    </span>
  );
};
