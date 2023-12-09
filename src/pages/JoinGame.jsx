import React, { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const JoinGame = () => {
  const socket = useSocket();
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setGameId(e.target.value);
  };

  const handleJoinGame = () => {
    if (gameId.trim() !== "") {
      // If the gameId is not empty, emit the 'join-game' event
      socket.emit("join-game", gameId);
    } else {
      setError("Please enter a Game ID");
    }
  };

  useEffect(() => {
    // Function to handle a full room (already two players)
    const handleRoomFull = () => {
      setError("The room is already full");
    };

    // Function to handle the second user joining
    const handleSecondUserJoined = () => {
      console.log("Second user has joined the room");
      // Navigate to the chess game screen
      navigate("/chess");
    };

    // Set up event listeners when the component mounts
    if (socket) {
      socket.on("roomFull", handleRoomFull);
      socket.on("secondUserJoined", handleSecondUserJoined);
    }

    // Clean up event listeners when the component unmounts
    return () => {
      if (socket) {
        socket.off("roomFull", handleRoomFull);
        socket.off("secondUserJoined", handleSecondUserJoined);
      }
    };
  }, [socket, navigate]);
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
            value={gameId}
            onChange={(e) => handleChange(e)}
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
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </>
  );
};

export default JoinGame;
