import { io } from "socket.io-client";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

let socket;

/**
 * Initializes and returns a shared Socket.io instance.
 * If a connection already exists, it returns the existing instance.
 */
export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: true,
    });
  }
  return socket;
};

/**
 * Disconnects the socket and clears the instance.
 * Useful during logout or global teardown.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
