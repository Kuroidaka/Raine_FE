import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = (p) => {
  const { children } = p;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://192.168.1.7:8001", {
      transports: ["websocket", "polling"],
      timeout: 20000
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

