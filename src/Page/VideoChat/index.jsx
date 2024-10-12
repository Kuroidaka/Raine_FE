import { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";

import CamScreen from "./camScreen";
import LogScreen from "./LogScr";
import DebugLog from "./DebugLog";
import { WebSocketContext } from "../../context/socket.context";
import { ToastContainer } from "react-toastify";
import ConversationContext, {
  ConversationProvider,
} from "../../Context/conversation.context";
import conversationApi from "../../api/conversation.api";
import {
  COLUMNS,
  IMAGE_QUALITY,
  IMAGE_WIDTH,
  MAX_SCREENSHOTS,
  SCREEN_COLUMNS,
  SCREEN_IMAGE_QUALITY,
  SCREEN_IMAGE_WIDTH,
  SCREEN_MAX_SCREENSHOTS,
} from "./constant";
import { imagesGrid } from "./helper";
import { base64ToFile, getWebmFileFromBlobUrl } from "../../Util";
import { useNavigate } from "react-router";

const VideoChat = () => {
  return (
    <ConversationProvider>
      <VideoChatInner />
    </ConversationProvider>
  );
};
const VideoChatInner = () => {
  const { cacheConversation, selectedConID } = useContext(ConversationContext);

  const isBusy = useRef(false);
  const canvasRef = useRef();
  const videoRef = useRef(null);
  const videoChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);

  const [botText, setBotText] = useState("");
  const [displayDebug, setDisplayDebug] = useState(false);
  const [phase, setPhase] = useState("not inited");
  const [transcription, setTranscription] = useState("");
  const [imagesGridUrl, setImagesGridUrl] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [progress, setProgress] = useState(null);

  const conID = useRef(selectedConID);
  const isScreenShare = useRef(false);
  const screenshotsRef = useRef([]);
  const streamRecordRef = useRef(null);

  const socket = useContext(WebSocketContext);
  const navigate = useNavigate();

  const handleProcessAI = async (message) => {
    //AI say
    console.log("ProcessAI");
    const videoUrl = await stopAndSaveCaptureVideo();

    const videoFile = videoUrl
      ? await getWebmFileFromBlobUrl(videoUrl, "my-video.webm")
      : null;

    console.log("videoFile", videoFile);

    setTranscription(message);
    setIsWaiting(true);
    setBotText("");

    const FrameFile =
      videoRef.current.srcObject !== null ? await videoProcess() : null;
    setPhase("user: processing completion");

    console.log("conID", conID);
    const { content, conversationID: returnedConID } = await handleSendClient({
      file: FrameFile,
      inputValue: message,
      conversationID: conID.current,
      ...(videoFile && { fileVideo: videoFile }),
    });
    console.log("returnedConID", returnedConID);

    setIsWaiting(false);
    if (conID.current === null) conID.current = returnedConID;

    await handleTTS(content);
    setProgress(null);
  };

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
      console.log(error);
      throw new error();
    } finally {
      setProgress(null);
    }
  };

  const handleSendClient = async ({
    inputValue,
    file,
    conversationID,
    fileVideo,
  }) => {
    // API CHAT
    try {
      const data = {
        prompt: inputValue,
      };
      await cacheConversation.addMsg(data, false);

      const result = await conversationApi.createChatVideo(
        {
          prompt: inputValue,
          file,
          conversationID,
          fileVideo,
        },
        true
      );

      if (!selectedConID) {
        setTimeout(() => {
          navigate(`/chat/cam/${result.conversationID}`);
        }, 1500);
      }

      console.log("result", result);

      return result;
    } catch (error) {
      // result.content = error.message
      throw new Error();
    }
  };

  const videoProcess = async () => {
    setImagesGridUrl(null);
    setPhase("user: uploading video captures");

    // gen img grid
    const maxScreenshots = isScreenShare.current
      ? SCREEN_MAX_SCREENSHOTS
      : MAX_SCREENSHOTS;
    console.log("MAX_SCREENSHOTS", isScreenShare.current);

    screenshotsRef.current = screenshotsRef.current.slice(-maxScreenshots); // Keep only the last XXX screenshots

    const imageUrl = await imagesGrid({
      base64Images: screenshotsRef.current,
      columns: isScreenShare.current ? SCREEN_COLUMNS : COLUMNS,
      gridImageWidth: isScreenShare.current ? SCREEN_IMAGE_WIDTH : IMAGE_WIDTH,
      quality: isScreenShare.current ? SCREEN_IMAGE_QUALITY : IMAGE_QUALITY,
    });

    screenshotsRef.current = [];
    // downloadImageFromBase64(imageUrl)
    const file = base64ToFile(imageUrl);
    // const uploadUrls = await hostImages([imageUrl]);

    setImagesGridUrl(imageUrl);

    return file;
  };

  const captureVideo = async () => {
    try {
      if (mediaRecorderRef.current) return;

      if (videoRef.current && videoRef.current.srcObject) {
        console.log("Capturing video");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRecordRef.current = stream;
        // Create MediaRecorder
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            videoChunksRef.current.push(event.data);
          }
        };

        // Start recording
        mediaRecorder.start();
      }
      else {
        console.log("Can't get video source to record")
      }
    } catch (err) {
      console.error("Error accessing user media", err);
    }
  };

  const stopAndSaveCaptureVideo = () => {
    return new Promise((resolve, reject) => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = () => {
          try {
            // Create video blob after recording stops
            const videoBlob = new Blob(videoChunksRef.current, {
              type: "video/mp4",
            });
            const videoUrl = URL.createObjectURL(videoBlob);
            console.log(videoUrl);
            resolve(videoUrl); // Resolve the Promise with the video URL
          } catch (error) {
            reject(error); // Reject the Promise if there's an error
          }
        };
        mediaRecorderRef.current.stop(); // Stop recording
        mediaRecorderRef.current = null;
      } else {
        reject("MediaRecorder is not initialized");
      }
    });
  };

  const terminateCaptureVideo = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        console.log("terminateCaptureVideo");
        const stream = streamRecordRef.current;
        if (stream) {
          // Stop all tracks
          stream.getTracks().forEach((track) => track.stop());
        }
        mediaRecorderRef.current = null;
      };

      mediaRecorderRef.current.stop(); // Stop recording
    }
  };

  // Socket for streaming response from AI
  useEffect(() => {
    if (socket) {
      socket.on("chatResChunk", ({ content }) => {
        console.log("content", content);
        setBotText((prev) => {
          return prev + content;
        });
      });

      socket.on("processing", ({ message }) => {
        console.log("message", message);
        setProgress(message);
      });
    }

    // Clean up the connection on unmount
    return () => {
      if (socket) socket.off("chatResChunk");
      if (socket) socket.off("processing");
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
    handleProcessAI,
    captureVideo,
    stopAndSaveCaptureVideo,
    terminateCaptureVideo,
    conID,
  };

  const logScreenProp = {
    isWaiting,
    botText,
    setDisplayDebug,
    handleProcessAI,
    conversationId: conID.current,
    progress,
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
      <ToastContainer />
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
