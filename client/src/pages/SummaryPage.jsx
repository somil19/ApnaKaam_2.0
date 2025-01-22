/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { VictoryPie } from "victory";
import AvatarSelect from "../components/AvatarSelect";
import { useEffect, useState } from "react";
import { setUserAvatar, setUserName } from "../features/signUpSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { setTodos } from "../features/todoSlice";
function SummaryPage() {
  const dispatch = useDispatch();
  const [overAllPerformance, setOverAllPerformance] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const userName = useSelector((state) => state.signUp.userName);
  const Todos = useSelector((state) => state.todo.todos);
  const myDayTodos = Todos.filter((todo) => todo.day === "today");
  const myDayCompletedCount = myDayTodos.filter(
    (todo) => todo.completed
  ).length;
  const myDayUncompletedCount = myDayTodos.filter(
    (todo) => !todo.completed
  ).length;
  const totalCompletedCount = Todos.filter((todo) => todo.completed).length;
  const totalUncompletedCount = Todos.filter((todo) => !todo.completed).length;
  const token = useSelector((state) => state.signUp.token);
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);
  useEffect(() => {
    const fetchTodos = async () => {
      // setIsLoading(true);
      try {
        const { data: todayData } = await axios.get(
          `${backendUrl}/api/todo/getTodos/today`,
          { headers: { token } }
        );
        const { data: tomorrowData } = await axios.get(
          `${backendUrl}/api/todo/getTodos/tomorrow`,
          { headers: { token } }
        );
        const { data: upcomingData } = await axios.get(
          `${backendUrl}/api/todo/getTodos/upcoming`,
          { headers: { token } }
        );

        const allTodos = [
          ...todayData.todos,
          ...tomorrowData.todos,
          ...upcomingData.todos,
        ];

        dispatch(setTodos(allTodos));
      } catch (error) {
        console.error("Error fetching today's todos:", error.message);
      }
      // setIsLoading(false);
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
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center py-2  bg-gradient-to-br from-purple-200 to-indigo-400">
      <div className="p-10 bg-gray-100 rounded-lg shadow-md md:w-1/2 w-[90%] m-2 md:m-1">
        <h1 className="md:text-4xl text-3xl font-semibold  text-center text-gray-700 tracking-wide">
          Your Profile
        </h1>
        <div className="w-full  flex flex-col justify-center items-center mt-8">
          {" "}
          <AvatarSelect />
        </div>
        <div className="mb-4">
          <h1 className="text-md font-semibold mt-10 text-gray-700">
            Update Your Name <FontAwesomeIcon icon={faPenToSquare} />
          </h1>
          <div className="w-full mt-2 p-2 border flex justify-between bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <input
              type="text"
              value={userName}
              onChange={(e) => {
                dispatch(setUserName(e.target.value));
              }}
              readOnly={!isSave}
              className="w-full p-1 focus:outline-none"
            />
            <button
              className={`${
                isSave ? "bg-red-500 " : "bg-green-500"
              } py-1 px-3 rounded-md text-white`}
              onClick={() => {
                if (isSave) {
                  dispatch(setUserName(userName));
                }
                setIsSave(!isSave);
              }}
            >
              {isSave ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <h1 className="md:text-2xl text-xl font-bold my-8 text-start text-gray-700 ">
            Your Performance Status
          </h1>
          <div className="flex items-center justify-center space-x-4 mb-2">
            <button
              className={`${
                !overAllPerformance
                  ? "bg-white text-black border-2 border-blue-500"
                  : "bg-blue-500 text-white"
              } hover:bg-blue-500  py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onClick={() => setOverAllPerformance(true)}
            >
              My Day
            </button>
            <button
              className={`${
                overAllPerformance
                  ? "bg-white text-black border-2 border-blue-500"
                  : "bg-blue-500 text-white"
              } hover:bg-blue-500  py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
              onClick={() => setOverAllPerformance(false)}
            >
              Overall
            </button>
          </div>

          {Todos.length === 0 ? (
            <p className="text-center mt-5">No tasks found</p>
          ) : !overAllPerformance ? (
            <PieChartComponent
              completedCount={totalCompletedCount}
              uncompletedCount={totalUncompletedCount}
              length={Todos.length}
            />
          ) : myDayTodos.length > 0 ? (
            <PieChartComponent
              completedCount={myDayCompletedCount}
              uncompletedCount={myDayUncompletedCount}
              length={myDayTodos.length}
            />
          ) : (
            <p className="text-center mt-5">No tasks found for today</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PieChartComponent({ completedCount, uncompletedCount, length }) {
  // const totalCount = todos.length;
  const completedPercentage = ((completedCount / length) * 100).toFixed(0);
  const data = [
    { x: "Completed", y: completedCount },
    { x: "Uncompleted", y: uncompletedCount },
  ];
  const getFontSize = () => {
    if (window.innerWidth <= 480) {
      return 23; // Font size for screens smaller than 480px
    } else if (window.innerWidth <= 768) {
      return 20; // Font size for screens smaller than 768px
    } else {
      return 18; // Default font size
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 ">
      <div className="w-full max-w-md bg-red-100 rounded-md ">
        <svg viewBox="0 0 500 350" className="w-full h-auto shadow-md pb-6 ">
          <g transform="translate(50, 0)">
            <VictoryPie
              standalone={false}
              data={data}
              colorScale={["#a9e432", "#ff6347"]}
              innerRadius={70}
              padAngle={5}
              labels={({ datum }) =>
                `${datum.x}: ${datum.y} (${((datum.y / length) * 100).toFixed(
                  0
                )}%)`
              }
              labelRadius={60}
              labelPosition={"outside"}
              style={{
                labels: {
                  fill: "black",
                  fontSize: getFontSize(),
                },
              }}
              width={400}
              height={400}
            />
          </g>
        </svg>
      </div>
      <h2 className="text-sm  text-gray-700">Task Completion Status</h2>
      <p className="text-lg text-gray-700">
        Completed: {completedCount} / {length} tasks ({completedPercentage}
        %)
      </p>
    </div>
  );
}
export default SummaryPage;
