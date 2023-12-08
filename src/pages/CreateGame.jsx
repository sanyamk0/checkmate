import React from "react";
import { useSocket } from "../contexts/SocketContext";
import { IoMdCreate } from "react-icons/io";

const CreateGame = () => {
  const socket = useSocket();
  const handleCreate = () => {
    console.log("Created");
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
            placeholder="Enter Name"
            className="w-56 h-12 font-semibold py-2 px-4 rounded-lg outline-none"
          />
          <button
            onClick={handleCreate}
            className="flex gap-2 items-center w-48 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            <IoMdCreate className="h-5 w-5" />
            Create Game
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateGame;
