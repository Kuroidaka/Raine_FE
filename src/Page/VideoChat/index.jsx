import { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";

import CamScreen from "./camScreen";
import LogScreen from "./LogScr";
import DebugLog from "./DebugLog";
import { WebSocketContext } from "../../Context/socket.context";
import { ToastContainer } from "react-toastify";



const VideoChat = () => {
  const isBusy = useRef(false);
  const canvasRef = useRef();
  const videoRef = useRef(null);

  const [botText, setBotText] = useState("");
  const [displayDebug, setDisplayDebug] = useState(false);
  const [phase, setPhase] = useState("not inited");
  const [transcription, setTranscription] = useState("");
  const [imagesGridUrl, setImagesGridUrl] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [conID, setConID] = useState(null);
  const socket = useContext(WebSocketContext);
  // Socket for streaming response from AI
  useEffect(() => {
    if (socket) {
      socket.on("chatResChunk", ({ content }) => {
        setBotText(content);
      });
    }

    // Clean up the connection on unmount
    return () => {
      if (socket) socket.off("chatResChunk");
    };
  }, [socket]);

  const camScreenProp = {
    setPhase,
    socket,
    setIsWaiting,
    canvasRef,
    videoRef,
    setImagesGridUrl,
    setBotText,
    setTranscription,
    isBusy,
    conID, setConID

  };

  const logScreenProp = {
    isWaiting,
    botText,
    setDisplayDebug,
  };

  const debugProp = {
    displayDebug,
    setDisplayDebug,
    imagesGridUrl,
    transcription,
    phase,
  };

  return (
    <Container>
      <ToastContainer></ToastContainer>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="content">
        <CamScreen {...camScreenProp} />
        <LogScreen {...logScreenProp} />
      </div>

      <DebugLog {...debugProp} />
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background: var(--main-gradient);

  .title {
    display: flex;
    align-items: center;
    height: 8%;
    color: #ffffff;

    .back-icon {
      width: 45px;
      height: 45px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      padding: 7px;
      border-radius: 5px;
      align-items: center;
      border: 1px solid;

      &:hover {
        background-color: #ffffff;
        color: #292a38;
      }
    }
  }

  .content {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    height: 100%;
    margin: 0px 50px;
    width: auto;
  }
`;

export default VideoChat;
