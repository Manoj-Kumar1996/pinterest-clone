import React from "react";
import { PinData } from "../context/PinContext";
import { PinCard } from "../components/PinCard";
import Masonry from "react-masonry-css";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";

const Account = ({ user }) => {
  const navigate = useNavigate();
  const { setIsAuth, setUser } = UserData();
  const logoutHandler = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        const { data } = await axios.get("/api/user/logout");
        toast.success(data.message);
        navigate("/login");
        setIsAuth(false);
        setUser([]);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const { pins } = PinData();

  let userPins;

  if (pins) {
    userPins = pins.filter((pin) => pin.owner === user._id);
  }
  // Masonry breakpoints for responsive columns
  const breakpointColumnsObj = {
    default: 5, // 4 columns for large screens
    1100: 3, // 3 columns for medium screens
    700: 2, // 2 columns for small screens
    500: 1, // 1 column for extra small screens
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center ">
        <div className="p-6 w-full">
          <div className="flex items-center justify-center ">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-3xl text-gray-700">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold mt-4">
            {user.name.toUpperCase()}
          </h1>
          <p className="text-center text-gray-600 mt-2">{user.email}</p>
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={logoutHandler}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              Logout
            </button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {userPins && userPins.length > 0 ? (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
              >
                {userPins.map((pin) => (
                  <PinCard key={pin._id} pin={pin} />
                ))}
              </Masonry>
            ) : (
              <h5 className="text-center text-gray-600 mt-4 font-bold">
                No pins found for this user.
              </h5>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
