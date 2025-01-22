import { useRef, useState } from "react";

import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const ResetPassword = ({ setShowResetPassword }) => {
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);
  axios.defaults.withCredentials = false;

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/send-reset-otp`,
        {
          email,
        }
      );
      console.log(data);
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    // toast.success("OTP submitted successfully");
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/reset-password",
        { email, otp, newPassword }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setShowResetPassword(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-96 flex-col flex justify-center items-center mt-10">
      <Toaster />

      {/* enter email id */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="mx-auto max-w-xs flex flex-col "
        >
          <h1 className=" text-2xl font-semibold text-center mb-4">
            Forgot Password?
          </h1>
          <p className=" mb-10 text-slate-700 text-sm ">
            No Problem! Enter your email below and we will send you an email
            with instructions to reset your password.
          </p>

          <input
            type="email"
            placeholder="Email id"
            className="w-full px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}

      {/* otp input form */}
      {!isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitOTP}
          className="mx-auto max-w-xs flex flex-col "
        >
          <h1 className=" text-2xl font-semibold text-center mb-4">
            Reset password OTP
          </h1>
          <p className="text-center mb-10 text-slate-700 text-md">
            Enter the 6-digit code sent to your email id.
          </p>
          <div className="flex justify-between mb-8" onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12  bg-gray-100  text-center text-xl rounded-md focus:outline-none"
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
            Submit
          </button>
        </form>
      )}

      {/* enter new password */}
      {isOtpSubmitted && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="mx-auto max-w-xs flex flex-col "
        >
          <h1 className=" text-2xl font-semibold text-center mb-4 ">
            New password
          </h1>
          <p className=" mb-10 text-slate-700 text-md text-center ">
            Enter the new password below
          </p>

          <input
            type="password"
            placeholder="Password"
            className="w-[300px] px-6 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
            Submit
          </button>
        </form>
      )}
      <p className="mt-6 text-lg text-gray-600 text-center">
        Back to{" "}
        <a
          onClick={() => setShowResetPassword(false)}
          className="border-b border-gray-500 border-dotted text-blue-700 cursor-pointer"
        >
          Login
        </a>
      </p>
    </div>
  );
};

export default ResetPassword;
