/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserAvatar } from "../features/signUpSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import defaultAvatar from "../assets/user.png"; // Default avatar image

function AvatarSelect() {
  const dispatch = useDispatch();
  const userAvatar = useSelector((state) => state.signUp.avatar);
  const token = useSelector((state) => state.signUp.token);
  const backendUrl = useSelector((state) => state.todoForm.backendUrl);
  const [isLoading, setIsLoading] = useState(false);
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file

    if (file) {
      const imgUrl = URL.createObjectURL(file); // Create a temporary URL for preview
      dispatch(setUserAvatar({ file, imgUrl })); // Dispatch the file and preview URL to Redux

      if (userAvatar.imgUrl) {
        try {
          const formData = new FormData();
          formData.append("avatar", file); // Append the file to the form data

          // Send the update request to the server
          const { data } = await axios.post(
            `${backendUrl}/api/user/updateAvatar`,
            formData,
            {
              headers: { token },
            }
          );

          if (data.success) {
            // Update Redux with the new profile image URL
            dispatch(setUserAvatar({ imgUrl: data.profileImage }));
          } else {
            console.error("Failed to update profile image:", data.message);
          }
        } catch (error) {
          console.error("Error updating profile image:", error);
        }
      }
    } else {
      console.error("No file selected.");
    }
  };

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      const fetchUser = async () => {
        try {
          const { data } = await axios.get(
            `${backendUrl}/api/user/userDetails`,
            {
              headers: { token },
            }
          );
          const { user } = data;
          // console.log(user);
          dispatch(setUserAvatar({ imgUrl: user.profileImage }));
        } catch (error) {
          console.error("Error fetching today's todos:", error.message);
        }
        setIsLoading(false);
      };
      fetchUser();
    }
  }, []);

  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden input
  };
  const imgSrc = userAvatar.imgUrl ? userAvatar.imgUrl : defaultAvatar;

  return (
    <div className="avatar-select">
      {/* Avatar Display */}
      {isLoading ? (
        ""
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={imgSrc}
            alt="Avatar"
            className="h-[140px] w-[140px] border-2 border-gray-200 rounded-full object-cover"
          />
          <div className="mt-4 ">
            <label
              className="block text-gray-600 font-serif cursor-pointer"
              onClick={handleClick}
            >
              Update Your Avatar
              <FontAwesomeIcon
                icon={faUpload}
                className="ml-2 cursor-pointer"
              />
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="mt-2 hidden"
            />
          </div>
        </div>
      )}{" "}
    </div>
  );
}

export default AvatarSelect;
