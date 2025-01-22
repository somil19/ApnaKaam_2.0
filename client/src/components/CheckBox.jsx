import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTodo } from "../features/todoSlice";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
// eslint-disable-next-line react/prop-types
function CheckBox({ id }) {
  const dispatch = useDispatch();
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);
  const todo = useSelector((state) =>
    state.todo.todos.find((todo) => todo._id === id)
  );

  const { completed } = todo;
  const [isChecked, setIsChecked] = useState(completed);

  const handleToggleTodo = async () => {
    const { data } = await axios.post(
      `${backendUrl}/api/todo/handleCompleteTodo/${id}`
    );
    if (data.success) {
      setIsChecked((pre) => !pre);
      dispatch(toggleTodo(id));
    } else {
      console.log(data.message);
    }
  };

  return (
    <div className="relative">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggleTodo}
        className={`cursor-pointer h-6 w-6 appearance-none border-2 rounded-full transition duration-300 
      ${
        isChecked
          ? "bg-green-400 border-green-500 ring-2 ring-green-300"
          : "bg-gray-100 border-gray-400 hover:bg-gray-200"
      }`}
      />
      {isChecked && (
        <FontAwesomeIcon
          icon={faCheck}
          className="absolute inset-0 m-auto h-4.5 w-4.5 mb-2.5 text-white pointer-events-none"
        />
      )}
    </div>
  );
}

export default CheckBox;
