import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

let socket = null;

export const connectSocket = (token) => {
  if (!socket && token) {
    socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      transports: ["websocket"] 
    });
  }
  return socket;
};

export const getSocket = () => socket;
