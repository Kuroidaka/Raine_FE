import { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";

import CamScreen from "./camScreen";
import LogScreen from "./LogScr";
import DebugLog from "./DebugLog";
import { WebSocketContext } from "../../Context/socket.context";
import { ToastContainer } from "react-toastify";
import { ConversationProvider } from "../../Context/conversation.context";
import conversationApi from "../../api/conversation.api";
import { COLUMNS, IMAGE_QUALITY, IMAGE_WIDTH, MAX_SCREENSHOTS, SCREEN_COLUMNS, SCREEN_IMAGE_QUALITY, SCREEN_IMAGE_WIDTH, SCREEN_MAX_SCREENSHOTS } from "./constant";
import { imagesGrid } from "./helper";
import { base64ToFile } from "../../Util";


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

  const conID = useRef(null);
  const isScreenShare = useRef(false)
  const screenshotsRef = useRef([]);
  
  const socket = useContext(WebSocketContext);
  
  const handleProcessAI = async (message) => { //AI say
    setTranscription(message);
    setIsWaiting(true);
    setBotText("")

    const FrameFile = videoRef.current.srcObject !== null ? await videoProcess() : null
    setPhase("user: processing completion");

    console.log("conID", conID)
    const { content, conversationID: returnedConID } = await handleSendClient({
      file: FrameFile,
      inputValue: message,
      conversationID: conID.current
    });
    console.log("returnedConID", returnedConID)
    setIsWaiting(false);
    if(conID.current === null) conID.current = returnedConID 

    await handleTTS(content)
  }

  const handleTTS = async (content) => {
    try {

      if (content && typeof content === "string") {

        setPhase("assistant: processing text to speech");

        const ttsFormData = new FormData();
        ttsFormData.append("input", content);

        await conversationApi.tts(content);

        setPhase("assistant: playing audio");

      }
    
    } catch (error) {
      console.log(error)
      throw new error
    }
  }

  const handleSendClient = async ({ inputValue, file, conversationID }) => {
    let result 

    // API CHAT
    try {
      result = await conversationApi.createChatVideo({
        prompt: inputValue,
        file,
        conversationID
      }, true);
      console.log("final response: ", result.content);
      // setBotText(result.content)
      
    } catch (error) {
      // result.content = error.message
      throw new Error
    }

    return result
  };
    
  const videoProcess = async () => {
    setImagesGridUrl(null);
    setPhase("user: uploading video captures");

    // gen img grid
    const maxScreenshots = isScreenShare.current ? SCREEN_MAX_SCREENSHOTS : MAX_SCREENSHOTS
    console.log("MAX_SCREENSHOTS", isScreenShare.current)

    screenshotsRef.current = screenshotsRef.current.slice(
      -maxScreenshots
    ); // Keep only the last XXX screenshots

    const imageUrl = await imagesGrid({
      base64Images: screenshotsRef.current,
      columns: isScreenShare.current ? SCREEN_COLUMNS : COLUMNS,
      gridImageWidth: isScreenShare.current ? SCREEN_IMAGE_WIDTH : IMAGE_WIDTH ,
      quality: isScreenShare.current ? SCREEN_IMAGE_QUALITY : IMAGE_QUALITY,
    });

    screenshotsRef.current = [];
    // downloadImageFromBase64(imageUrl)
    const file = base64ToFile(imageUrl)
    // const uploadUrls = await hostImages([imageUrl]);

    setImagesGridUrl(imageUrl);

    return file
  }


  // Socket for streaming response from AI
  useEffect(() => {
    if (socket) {
      socket.on("chatResChunk", ({ content }) => {
        console.log("content", content)
        setBotText(prev => {
          return prev + content
        });
      });
    }

    // Clean up the connection on unmount
    return () => {
      if (socket) socket.off("chatResChunk");
    };
  }, [socket]);

  const camScreenProp = {
    setPhase,
    setIsWaiting,
    canvasRef,
    setBotText,
    isBusy,
    videoRef,
    isScreenShare,
    screenshotsRef,
    handleProcessAI
  };

  const logScreenProp = {
    isWaiting,
    botText,
    setDisplayDebug,
    handleProcessAI,
    conversationId: conID.current
  };

  const debugProp = {
    displayDebug,
    setDisplayDebug,
    imagesGridUrl,
    transcription,
    phase,
  };

  return (
    <ConversationProvider>
      <Container>
        <ToastContainer />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div className="content">
          <CamScreen {...camScreenProp} />
          <LogScreen {...logScreenProp} />
        </div>

        <DebugLog {...debugProp} />
      </Container>
    </ConversationProvider>
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
