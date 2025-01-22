/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTodo } from "../features/todoSlice";
import { setUpdateFormState } from "../features/todoFormSlice";
import save from "../assets/save.mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
// import clockSound from "../assets/alarm-sound.mp3";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
export default function UpdateForm({ todoToUpdate }) {
  const [title, setTitle] = useState(todoToUpdate.title);
  const [dueReminder, setDueReminder] = useState("");
  const [showRemBtn, setShowRemBtn] = useState(true);
  const [category, setCategory] = useState(todoToUpdate.category);
  const [priority, setPriority] = useState(todoToUpdate.priority);
  const [notes, setNotes] = useState(todoToUpdate.notes);
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);
  const token = useSelector((state) => state.signUp.token);
  const dispatch = useDispatch();
  const name = useSelector((state) => state.signUp.userName);
  const email = useSelector((state) => state.signUp.email);
  //not working in backend but working in frontend
  // const handleUpdateTodo = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const { data } = await axios.post(
  //       `${backendUrl}/api/todo/updateTodo/${todoToUpdate._id}`,
  //       {
  //         title,
  //         category,
  //         priority,
  //         notes,
  //         reminder: dueReminder,
  //         todoUpdatedAt: new Date().toLocaleString("en-US", {
  //           month: "short", // "Jan"
  //           day: "2-digit", // "16"
  //           year: "numeric", // "2025"
  //           hour: "2-digit", // "2"
  //           minute: "2-digit", // "30"
  //           hour12: true, // Use 12-hour format with AM/PM
  //         }),
  //       },
  //       { headers: { token } }
  //     );
  //     if (data.success) {
  //       console.log(data.todo);
  //       dispatch(
  //         updateTodo({
  //           id: todoToUpdate._id,
  //           title,
  //           reminder: dueReminder,
  //           priority,
  //           category,
  //           notes,
  //           todoUpdatedAt: new Date().toLocaleString("en-US", {
  //             month: "short", // "Jan"
  //             day: "2-digit", // "16"
  //             year: "numeric", // "2025"
  //             hour: "2-digit", // "2"
  //             minute: "2-digit", // "30"
  //             hour12: true, // Use 12-hour format with AM/PM
  //           }),
  //         })
  //       );
  //       toast.success("Todo Updated successfully");
  //       const saveSound = new Audio(save);
  //       saveSound.play();

  //       dispatch(setUpdateFormState(false));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const handleUpdateTodo = async (e) => {
    e.preventDefault();
    try {
      dueReminder && handleReminderSubmit();
      const todoUpdatedAt = new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const { data } = await axios.post(
        `${backendUrl}/api/todo/updateTodo/${todoToUpdate._id}`,
        {
          title,
          category,
          priority,
          notes,
          reminder: dueReminder,
          todoUpdatedAt,
        },
        { headers: { token } }
      );

      if (data.success) {
        dispatch(
          updateTodo({
            id: todoToUpdate._id,
            title,
            category,
            priority,
            notes,
            reminder: dueReminder,
            todoUpdatedAt,
          })
        );

        toast.success("Todo Updated successfully");
        new Audio(save).play();
        dispatch(setUpdateFormState(false));
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };
  const handleReminderSubmit = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/schedule-email`, {
        email, // Replace with the user's email
        title,
        category,
        name,
        sendTime: dueReminder, // Date & time set by the user
      });
    } catch (error) {
      toast.error("Error scheduling reminder: " + error.message);
      console.error("Error scheduling reminder:", error.message);
    }
  };
  const handleSetReminder = () => {
    const currentTime = new Date();
    const scheduledTime = new Date(dueReminder);
    if (scheduledTime < currentTime) {
      toast.error("Please select a future date and time.");
    } else toast.success("Reminder email scheduled successfully!");
  };
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full space-y-4">
        <div className="flex items-center justify-between py-6">
          <h2 className="text-2xl font-bold text-gray-800">Update Todo</h2>
          <FontAwesomeIcon
            icon={priority ? solidStar : regularStar}
            size="2x"
            onClick={() => setPriority(!priority)}
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
        <form onSubmit={handleUpdateTodo} className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              placeholder="Title"
            />
          </div>
          <div className="flex items-center space-x-4">
            {showRemBtn ? (
              <button
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
              // <>
              //   <label htmlFor="category" className="text-gray-600">
              //     Add Date and Time
              //   </label>
              //   <input
              //     type="datetime-local"
              //     id="dueDate"
              //     name="dueDate"
              //     value={dueReminder}
              //     onChange={(e) => setDueReminder(e.target.value)}
              //     className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              //     style={{
              //       // Style the calendar picker indicator
              //       WebkitAppearance: "none", // Disable default appearance
              //       appearance: "none",
              //       paddingLeft: "0.5rem", // Adjust padding to prevent overlap with the indicator
              //       color: "black",
              //       backgroundColor: "lightblue",
              //     }}
              //   />
              //   <button
              //     onClick={() => setShowRemBtn(true)}
              //     className="bg-gray-200 px-2 py-1 rounded-full"
              //   >
              //     <FontAwesomeIcon icon={faXmark} />
              //   </button>
              // </>
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
                    onClick={handleSetReminder}
                    type="button"
                    className="md:px-2 md:py-1   md:bg-green-400 md:text-white md:rounded-3xl md:hover:bg-green-500 text-green-500 focus:outline-none  hover:scale-125 transition-all duration-500"
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
            <select
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
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Notes"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                // Handle closing the form if needed
                dispatch(setUpdateFormState(false));
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
            >
              Discard
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
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
