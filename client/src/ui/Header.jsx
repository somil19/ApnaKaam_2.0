import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import apnaKaam from "../assets/apna-kaam.png";
import { useSelector } from "react-redux";

import DropDown from "../ui/DropDown";
export default function Header() {
  const [selectedOption, setSelectedOption] = useState("/today");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    navigate(selectedValue);
    // Navigate to the selected option's path
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const userName = useSelector((state) => state.signUp.userName);
  const userAvatar = useSelector((state) => state.signUp.avatar);

  return (
    <>
      <nav className="bg-gray-100 shadow-lg px-4 py-2 lg:px-8 lg:py-4 ">
        {" "}
        <div className="container mx-auto flex items-center justify-between text-blue-900">
          {" "}
          <div className="w-1/3">
            {" "}
            <img
              src={apnaKaam}
              alt=""
              height={150}
              width={150}
              onClick={() => navigate("/todos/today")}
              className="cursor-pointer hover:ring-2 hover:ring-purple-300 p-1 "
            />{" "}
          </div>{" "}
          <div className="flex items-center space-x-4 w-1/2 justify-center">
            {" "}
            <ul className="hidden lg:flex   items-center space-x-4">
              {" "}
              <li>
                {" "}
                <NavLink
                  to="/todos/today"
                  className={({ isActive }) =>
                    `block py-2 pr-4 font-semibold pl-3 duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 hover:texxt-lg lg:p-0 ${
                      isActive && "text-orange-800 text-lg"
                    }`
                  }
                >
                  {" "}
                  Today{" "}
                </NavLink>{" "}
              </li>{" "}
              <li>
                {" "}
                <NavLink
                  to="/todos/tomorrow"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 font-semibold duration-200 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 hover:texxt-lg lg:p-0 ${
                      isActive && "text-orange-800 text-lg"
                    }`
                  }
                >
                  {" "}
                  Tomorrow{" "}
                </NavLink>{" "}
              </li>
              <li>
                {" "}
                <NavLink
                  to="/todos/upcoming"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 duration-200 font-semibold border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 hover:texxt-lg lg:p-0 ${
                      isActive && "text-orange-800 text-lg"
                    }`
                  }
                >
                  {" "}
                  Upcoming{" "}
                </NavLink>{" "}
              </li>{" "}
            </ul>
            <select
              className="block lg:hidden p-2 border border-gray-300 rounded-md"
              value={selectedOption}
              onChange={handleSelectChange}
            >
              <option value="/todos/today">Today</option>
              <option value="/todos/tomorrow">Tomorrow</option>
              <option value="/todos/upcoming">Upcoming</option>
            </select>{" "}
          </div>
          <div className="w-1/3 flex items-center justify-end gap-x-3 capitalize">
            {" "}
            <p className="hidden lg:block">{userName}</p>{" "}
            <img
              src={userAvatar.imgUrl}
              alt={userAvatar}
              className="rounded-full h-[50px] w-[50px] object-cover border-2 border-indigo-400 hover:border-4 hover:border-indigo-500 p-1 cursor-pointer"
              onClick={() => toggleDropdown()}
            />{" "}
          </div>{" "}
        </div>{" "}
      </nav>

      {showDropdown && <DropDown setShowDropdown={setShowDropdown} />}
    </>
  );
}
