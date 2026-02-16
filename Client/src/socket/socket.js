import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (!socket && token) {
    socket = io("https://multi-tenent-chat-app.onrender.com", {
      auth: { token },
      withCredentials: true
    });
  }
  return socket;
};

export const getSocket = () => socket;
