/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeTodo, setTodos } from "../features/todoSlice";
import UpdateForm from "../components/UpdateForm";
import delSound from "../assets/delete.mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faFilePen,
  faPlusCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { setUpdateFormState, setFormState } from "../features/todoFormSlice";

import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import CheckBox from "./CheckBox";

import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "./SearchBar";
import TaskSummary from "./TaskSummary";

const deleteSound = new Audio(delSound);
export default function TodoList({ Todos, day }) {
  // console.log(Todos);
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/todo/getTodos/${day}`,
          {
            headers: { token },
          }
        );

        dispatch(setTodos(data.todos));
      } catch (error) {
        console.error("Error fetching today's todos:", error.message);
      }
    };
    fetchTodos();
  }, [day]);
  const isUpdateForm = useSelector((state) => state.todoForm.isUpdateForm);

  const dispatch = useDispatch();
  const [selectedTodo, setSelectedTodo] = useState(null); // State to store selected todo
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [sortBy, setSortBy] = useState("aplhabetical"); // State to store sort by option
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);
  const [showSummary, setShowSummary] = useState(false);
  const token = useSelector((state) => state.signUp.token);
  const todosLength = Todos.length;

  const filteredTodos = Todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(Todos);
  const handleUpdateTodo = (todo) => {
    setSelectedTodo(todo);
    console.log(selectedTodo);
    dispatch(setUpdateFormState(true));
  };

  async function handleDeteleTodo(id) {
    const { data } = await axios.delete(
      `${backendUrl}/api/todo/removeTodo/${id}`,
      { headers: { token } }
    );
    // console.log(data);
    if (data.success) {
      toast.success(data.message);
      // console.log(data.message);
      dispatch(removeTodo(id));
      deleteSound.play();
    } else if (data.success === false) {
      toast.error(data.message);
      // console.log(data.message);
    }
  }
  const sortTodos = (a, b) => {
    if (sortBy === "priority") {
      return b.priority - a.priority;
    } else if (sortBy === "incompleted") {
      return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
    } else if (sortBy === "completed") {
      return a.completed === b.completed ? 0 : a.completed ? -1 : 1;
    } else if (sortBy === "aplhabetical") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "inputOrder") {
      return a._id - b._id;
    }

    return 0;
  };
  return (
    <div className="w-full min-h-screen mx-auto flex flex-col justify-start items-center  ">
      <Toaster />
      <h1 className=" rounded-xl text-lg items-left md:text-2xl capitalize mt-4  ">
        Your {day}&apos;s Tasks
      </h1>
      <div className="flex flex-col md:flex-row items-center md:items-baseline w-full md:w-1/2 mt-6 justify-center ">
        {" "}
        <label
          className="text-gray-700 md:mr-4 md:text-right text-sm"
          htmlFor="sort-by"
        >
          {" "}
          Sort By
        </label>{" "}
        <select
          className="md:mr-4  px-3 py-1 md:w-36 rounded-md bg-gradient-to-br from-red-200 to-red-300 focus:outline-none   w-2/5 text-xs"
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          {" "}
          <option value="alphabetical">Alphabetical </option>{" "}
          <option value="priority">Priority</option>{" "}
          <option value="completed">Completed</option>{" "}
          <option value="incompleted">Uncompleted</option>{" "}
          <option value="inputOrder">Input Order</option>{" "}
        </select>{" "}
        <SearchBar setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
      </div>
      <ul className="list-none w-full md:w-1/2 mt-6">
        {" "}
        {todosLength > 0 ? (
          filteredTodos.sort(sortTodos).map((todo) => (
            <li
              className={`mt-4 mx-auto flex   justify-between items-center w-[90%] md:w-full bg-blue-100  px-4 py-2 rounded-lg shadow-md transition-transform ease-out duration-100 transform hover:translate-x-1`}
              key={todo._id}
            >
              {" "}
              <div className="flex items-center  ">
                {" "}
                {/* Checkbox */} <CheckBox id={todo._id} />{" "}
                <div
                  className={`${
                    todo.completed ? "line-through text-gray-400" : ""
                  } font-medium text-gray-800  ml-4 text-sm md:text-md`}
                >
                  {" "}
                  {todo.title}
                </div>{" "}
                {todo.priority ? (
                  <FontAwesomeIcon
                    icon={solidStar}
                    style={{ color: "gold" }}
                    className="ml-2"
                  />
                ) : (
                  " "
                )}
              </div>{" "}
              <div className="flex items-center md:ml-4">
                <div className="flex items-center gap-3 ">
                  <button
                    onClick={() => {
                      setShowSummary(true);
                      setSelectedTodo(todo);
                    }}
                    className="text-gray-500  md:bg-indigo-200  md:border border-gray-100 md:py-1 md:px-3 focus:outline-none md:hover:bg-indigo-300  rounded-lg"
                  >
                    <FontAwesomeIcon
                      icon={faBook}
                      size="lg"
                      className="text-indigo-300 hover:text-indigo-600 md:text-gray-500"
                    />
                  </button>
                  <button
                    onClick={() => handleUpdateTodo(todo)}
                    className="text-gray-500  md:bg-blue-200  md:border border-gray-100 md:py-1 md:px-3 focus:outline-none md:hover:bg-blue-300  rounded-lg"
                  >
                    <FontAwesomeIcon
                      icon={faFilePen}
                      size="lg"
                      className="text-blue-300 hover:text-blue-600 md:text-gray-500"
                    />{" "}
                  </button>{" "}
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeteleTodo(todo._id)}
                    className="text-gray-500  md:bg-red-200  md:border border-gray-100 md:py-1 md:px-3 focus:outline-none md:hover:bg-red-300    rounded-lg "
                  >
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size="lg"
                      className="text-red-400 hover:text-red-600 md:text-gray-500"
                    />
                  </button>
                </div>
              </div>{" "}
            </li>
          ))
        ) : (
          <li className="mt-8 flex items-center justify-center">
            {" "}
            <button
              onClick={() => dispatch(setFormState(true))}
              className="rounded-lg relative w-64 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
            >
              <span className="text-white font-semibold ml-8 transform group-hover:translate-x-16 transition-all duration-300">
                Add Your First Todo
              </span>
              <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size="lg"
                  className=" text-white"
                />
              </span>
            </button>
          </li>
        )}{" "}
        {todosLength >= 1 && (
          <li className="mt-8 flex items-center justify-center">
            {" "}
            <button
              onClick={() => dispatch(setFormState(true))}
              className="rounded-lg relative w-64 h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500"
            >
              <span className="text-white font-semibold ml-8 transform group-hover:translate-x-16 transition-all duration-300">
                Add More Todo's
              </span>
              <span className="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size="lg"
                  className=" text-white"
                />
              </span>
            </button>
          </li>
        )}
      </ul>
      {showSummary && (
        <TaskSummary todo={selectedTodo} setShowSummary={setShowSummary} />
      )}
      {isUpdateForm && <UpdateForm todoToUpdate={selectedTodo} />}
    </div>
  );
}
