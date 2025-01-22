/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrinWink, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import pencil from "../assets/write.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFormState } from "../features/todoFormSlice";
import pop from "../assets/pop.mp3";
// import { use } from "react";
export default function Welcome() {
  const userName = useSelector((state) => state.signUp.userName);
  console.log(userName);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sound = new Audio(pop);
  function handleFirstAdd() {
    navigate("/todos/today");
    dispatch(setFormState(true));
    sound.play();
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-purple-500">
      {" "}
      <div className="py-16 md:py-24 lg:py-32">
        {" "}
        <div className="max-w-3xl mx-auto px-4">
          {" "}
          <h1 className="text-4xl lg:text-5xl text-center capitalize text-white font-bold tracking-wide">
            {" "}
            Welcome, {userName} !{" "}
          </h1>{" "}
          <div className="flex justify-center mt-8 ">
            {" "}
            <img className="h-72 w-72 " src={pencil} alt="Logo" />{" "}
          </div>{" "}
          <h2 className="text-center text-2xl text-white font-semibold mt-6">
            {" "}
            Start Your Day with a Smile <FontAwesomeIcon
              icon={faGrinWink}
            />{" "}
            {/* and Say{" "}
            <p className="text-3xl font-bold text-pink-200">"Radhe Radhe!"</p> */}
          </h2>{" "}
          <p className="text-center text-white mt-4">
            {" "}
            Add your tasks by clicking the button below{" "}
          </p>{" "}
          <button
            className="block animate-bounce mx-auto mt-10 bg-white hover:bg-gray-200 text-purple-500 hover:text-purple-600 rounded-full px-12 py-6 focus:outline-none focus:ring-4 focus:ring-purple-200"
            onClick={handleFirstAdd}
          >
            {" "}
            <FontAwesomeIcon icon={faPlusCircle} size="2x" />{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
