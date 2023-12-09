import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { IoMdCopy, IoMdCreate } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const CreateGame = () => {
  const socket = useSocket();
  const textToCopyRef = useRef(null);
  const [name, setName] = useState("");
  const [serverData, setServerData] = useState(null);
  const [copy, setCopy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleCreate = () => {
    socket.emit("create", name); // Emits a Name to Backend/Server
    setName("");
  };

  // Function to Copy Game Id to Clipboard
  const handleCopyClick = () => {
    // Create a range object to represent the selected content
    const range = document.createRange();
    // Select the entire content within the specified DOM element
    range.selectNode(textToCopyRef.current);
    // Create a selection object to manage the selected content
    const selection = window.getSelection();
    // Clear any existing selections
    selection.removeAllRanges();
    // Add the new range to the selection
    selection.addRange(range);
    try {
      // Attempt to copy the selected text to the clipboard
      document.execCommand("copy");
      setCopy(true);
    } catch (err) {
      // Handle errors during the copy operation
      console.error("Unable to copy text to clipboard.", err);
      alert("Failed to copy text. Please copy it manually.");
    }
    // Clear the selection to avoid interference with subsequent selections
    selection.removeAllRanges();
  };

  useEffect(() => {
    // Function to set serverData after getting Response from server to Display it
    const handleCreateResponse = (args) => {
      setServerData({ name: args.name, randomId: args.randomId });
    };
    // Check if the socket exists before setting up the event listener
    if (socket) {
      socket.on("create", handleCreateResponse);
      socket.on("secondUserJoined", () => {
        console.log("Second user has joined the room");
        navigate("/chess"); // Navigate to the chess game screen
      });
    }
    // Clean up the event listener when the component unmounts
    return () => {
      // Check if the socket and event listener exist before removing
      if (socket) {
        socket.off("create", handleCreateResponse);
        socket.off("secondUserJoined");
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
        {serverData ? (
          <div className="flex flex-col justify-center items-center gap-2">
            <p className="text-3xl mb-5">
              Hello{" "}
              <span className="font-bold capitalize">{serverData.name}</span> !!
              Welcome to Checkmate
            </p>
            <div className="flex gap-3 justify-center items-center">
              <p className="text-3xl">Your Game Id: </p>
              <div
                ref={textToCopyRef}
                className="bg-gray-800 text-white p-2 rounded-md overflow-auto flex justify-center items-center gap-2"
                style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
              >
                {serverData.randomId}
                <button
                  onClick={handleCopyClick}
                  className="text-3xl"
                  title="Copy Game Id"
                >
                  {copy ? (
                    <TiTick className="h-7 w-7" />
                  ) : (
                    <IoMdCopy className="h-7 w-7" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-5">
            <input
              type="text"
              placeholder="Enter Name"
              className="w-56 h-12 font-semibold py-2 px-4 rounded-lg outline-none"
              value={name}
              onChange={(e) => handleChange(e)}
            />
            <button
              onClick={handleCreate}
              disabled={name.trim() === ""} // To Disable Button Click until user Enters a Name
              className="flex gap-2 items-center w-48 h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg"
            >
              <IoMdCreate className="h-5 w-5" />
              Create Game
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateGame;
