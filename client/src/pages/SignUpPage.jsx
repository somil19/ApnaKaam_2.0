/* eslint-disable react/no-unescaped-entities */
import apnaKaam from "../assets/apna-kaam.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserId,
  setUserName,
  signUpSuccess,
  setUserEmail,
  setUserPassword,
  setToken,
  setUserAvatar,
} from "../features/signUpSlice";
import AvatarSelect from "../components/AvatarSelect";
import { useNavigate } from "react-router-dom";
import begin from "../assets/begin.mp3";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../ui/Loader";
import ResetPassword from "./ResetPassword";
// import { useNavigate } from "react-router-dom";
export default function SignUpPage() {
  const [isLogin, setIsLogin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector((state) => state.signUp.userName);
  const userEmail = useSelector((state) => state.signUp.email);
  const userPassword = useSelector((state) => state.signUp.password);
  const userAvatar = useSelector((state) => state.signUp.avatar);
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);
  const beginSound = new Audio(begin);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log(userName, userEmail, userPassword);
    try {
      setIsLoading(true);
      if (isLogin) {
        console.log(userEmail, userPassword);
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email: userEmail,
          password: userPassword,
        });
        if (data.success) {
          toast.success("Successfully logged in!");
          beginSound.play();
          const { user } = data;
          dispatch(setToken(data.token));
          // dispatch(setUserAvatar(user.profileImage));
          dispatch(setUserEmail(userEmail));
          dispatch(setUserAvatar({ imgUrl: data.profileImage }));
          dispatch(signUpSuccess(true));
          dispatch(setUserName(user.name));
          setTimeout(() => {
            navigate("/welcome");
          }, 500);
        } else {
          toast.error("Invalid email or password!");
          console.log(data.message);
        }
      } else {
        const formData = new FormData();
        formData.append("name", userName);
        formData.append("email", userEmail);
        formData.append("password", userPassword);
        if (userAvatar.file) {
          formData.append("avatar", userAvatar.file);
        }
        await axios.post(`${backendUrl}/api/user/welcome-email`, {
          userName,
          email: userEmail,
        });
        const { data } = await axios.post(
          `${backendUrl}/api/user/register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // console.log("data", data);
        if (data.success) {
          toast.success("Successfully signed up!");
          beginSound.play();
          // console.log("sucdata", data);
          const { user } = data;
          // console.log("user ye", user);
          dispatch(setUserId(data.userId));
          dispatch(setToken(data.token));
          dispatch(setUserName(user.name));
          dispatch(setUserEmail(userEmail));
          dispatch(setUserAvatar({ imgUrl: data.profileImage }));
          dispatch(signUpSuccess(true));
          setTimeout(() => {
            navigate("/welcome");
          }, 500);
        } else {
          toast.error(data.message);
          console.log(data.message);
        }
      }
    } catch (error) {
      // toast.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };
  return (
    <div>
      <Toaster />
      {/* Radhe Radhe! */}
      <div className="min-h-screen bg-gray-200 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 bg-gradient-to-br from-blue-200 to-purple-400 ">
            <div className="mt-0 flex flex-col items-center ">
              <img src={apnaKaam} alt="" className="w-1/2" />{" "}
              {showResetPassword ? (
                <ResetPassword setShowResetPassword={setShowResetPassword} />
              ) : (
                <>
                  <div className="w-full flex flex-col justify-center items-center mt-14">
                    {!isLogin && <AvatarSelect />}
                  </div>
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <div className="w-full  mt-10 ">
                      <form
                        className="mx-auto max-w-xs flex flex-col gap-3 "
                        onSubmit={onSubmitHandler}
                      >
                        {isLogin && (
                          <h1 className=" text-2xl font-semibold text-center mb-10 ">
                            Login to your account
                          </h1>
                        )}
                        {!isLogin && (
                          <input
                            className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                            type="text"
                            placeholder="Name"
                            value={userName}
                            onChange={(e) =>
                              dispatch(setUserName(e.target.value))
                            }
                            required
                          />
                        )}
                        <input
                          className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                          type="text"
                          placeholder="Email"
                          value={userEmail}
                          onChange={(e) =>
                            dispatch(setUserEmail(e.target.value))
                          }
                          required
                        />
                        <input
                          className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                          type="text"
                          placeholder="Password"
                          value={userPassword}
                          onChange={(e) =>
                            dispatch(setUserPassword(e.target.value))
                          }
                          required
                        />
                        {isLogin && (
                          <a
                            className=" text-blue-700 cursor-pointer hover:underline "
                            onClick={() => setShowResetPassword(true)}
                          >
                            Forget Password?
                          </a>
                        )}
                        <button
                          type="submit"
                          className="mt-2 tracking-wide font-semibold bg-gradient-to-r from-indigo-500 to-indigo-900 text-gray-100 w-full py-3 rounded-lg  transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        >
                          <svg
                            className="w-6 h-6 -ml-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <path d="M20 8v6M23 11h-6" />
                          </svg>
                          <span className="ml-3">
                            {isLogin ? "Sign In" : "Sign Up"}
                          </span>
                        </button>
                      </form>

                      <p className="mt-6 text-md text-gray-600 text-center">
                        {" "}
                        Already have an account?{" "}
                        <a
                          onClick={() => setIsLogin((prev) => !prev)}
                          className="hover:underline text-blue-700 cursor-pointer"
                        >
                          {!isLogin ? "Sign In" : "Sign Up"}
                        </a>
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-end hidden  lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  " url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg'",
              }}
            >
              <span className="text-3xl font-mono font-semibold bg-purple-300 py-2 px-6 rounded-full">
                APNA TIME AYEGA !
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
