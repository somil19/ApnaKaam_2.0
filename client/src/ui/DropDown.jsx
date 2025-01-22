/* eslint-disable react/prop-types */
import {
  faRightFromBracket,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../features/signUpSlice";

export default function DropDown({ setShowDropdown }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handlLogOut() {
    navigate("/");
    dispatch(logOut());

    setShowDropdown(false);
  }
  const handleProfile = () => {
    navigate("/summary");
    setShowDropdown(false);
  };
  return (
    <div className="fixed inset-0  bg-gray-900 bg-opacity-50 flex  items-start justify-end z-50">
      <div className="flex  flex-col gap-y-3 bg-gray-100 border-2  font-semibold border-slate-400 mr-4 mt-20 px-8 py-6 rounded-lg ">
        <div className="text-end mb-3 ">
          <FontAwesomeIcon
            icon={faXmark}
            height={20}
            width={20}
            size="lg"
            className="cursor-pointer hover:bg-slate-300 p-2 rounded-full"
            onClick={() => setShowDropdown(false)}
          />
        </div>
        <p
          className=" hover:bg-slate-300 cursor-pointer py-3 px-4 rounded"
          onClick={handleProfile}
        >
          {" "}
          Profile <FontAwesomeIcon icon={faUser} />
        </p>
        <div className="h-0.5 w-full bg-slate-400"></div>
        <p
          className="hover:bg-slate-300 cursor-pointer py-3 px-4 rounded"
          onClick={handlLogOut}
        >
          {" "}
          Logout <FontAwesomeIcon icon={faRightFromBracket} />{" "}
        </p>
      </div>
    </div>
  );
}
