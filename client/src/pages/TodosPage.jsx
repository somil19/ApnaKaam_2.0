import { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

import Greeting from "../ui/Greeting";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTodos } from "../features/todoSlice";
import { useParams } from "react-router-dom";
import { setUserAvatar, setUserName } from "../features/signUpSlice";
import Loader from "../ui/Loader";

export default function TodosPage() {
  const dispatch = useDispatch();
  const { day } = useParams();
  const Todos = useSelector((state) => state.todo.todos);
  const dayTodos = Todos?.filter((todo) => todo.day === day) || [];
  const [isLoading, setIsLoading] = useState(false);
  const isOpen = useSelector((state) => state.todoForm.isOpen);
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);

  const token = useSelector((state) => state.signUp.token);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/userDetails`, {
          headers: { token },
        });
        // console.log(data);
        const { user } = data;
        dispatch(setUserName(user.name));
        dispatch(setUserAvatar({ imgUrl: user.profileImage }));
      } catch (error) {
        console.error("Error fetching today's todos:", error.message);
      }
    };
    fetchTodos();
    fetchUser();
  }, [day]);

  return (
    <div className="w-full min-h-screen mx-auto bg-gradient-to-br from-purple-200 to-indigo-400 ">
      {day === "today" && <Greeting />}
      {day === "today" && dayTodos === 0 && isOpen && <TodoForm day={day} />}
      {}
      {isLoading ? <Loader /> : <TodoList Todos={dayTodos} day={day} />}
      {isOpen && <TodoForm day={day} />}
    </div>
  );
}
