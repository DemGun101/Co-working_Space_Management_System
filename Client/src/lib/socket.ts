import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const socket = io(baseUrl, {
  withCredentials: true,
  autoConnect: true,
});

export const officeBoySocket = io(`${baseUrl}/office-boy`, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
});
