"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { io, Socket } from "@/node_modules/socket.io-client";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      path: "/api/socketio", // Match the server path
    });

    newSocket.on("connect", () => {
      console.log("Socket.IO connected", newSocket.id);
      setSocket(newSocket); // Set the socket in the state
      toast("Socket Connected!");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setSocket(null); // Clear socket on disconnect
      toast("Socket Disconnected! Reconnecting...");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      toast("Socket Failed To Connect | " + err);
    });

    return () => {
      newSocket.disconnect(); // Clean up on component unmount
    };
  }, []);

  return socket;
};

export default useSocket;
