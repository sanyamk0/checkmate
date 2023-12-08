import React from "react";
import { useSocket } from "../contexts/SocketContext";
import { BsFillPersonPlusFill } from "react-icons/bs";

const JoinGame = () => {
  const socket = useSocket();
  const handleJoinGame = () => {
    console.log("Joined");
  };
  return (
    <>
      <div className="w-[100vw] h-[100vh] flex flex-col items-center bg-gray-200">
        <div className="mb-6 p-4 mt-10">
          <img
            src="/assets/images/checkmate.jpg"
            alt="Checkmate"
            className="w-24 mx-auto bg-transparent rounded-lg"
          />
        </div>
        <p className="text-5xl font-semibold mb-10">Play Chess Online</p>
        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Enter Game Id"
            className="w-56 h-12 font-semibold py-2 px-4 rounded-lg outline-none"
          />
          <button
            onClick={handleJoinGame}
            className="flex gap-2 items-center w-48 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            <BsFillPersonPlusFill className="h-5 w-5" />
            Join Game
          </button>
        </div>
      </div>
    </>
  );
};

export default JoinGame;
