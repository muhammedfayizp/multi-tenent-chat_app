import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (!socket && token) {
    socket = io("http://localhost:4000", {
      auth: { token },
      withCredentials: true
    });
  }
  return socket;
};

export const getSocket = () => socket;
