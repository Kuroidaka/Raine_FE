import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import CamScreen from "./camScreen";
import LogScreen from "./LogScr";
import DebugLog from "./DebugLog";
import useMediaRecorder from "@wmik/use-media-recorder";
import { useLocation } from "react-router";
import useSilenceAwareRecorder from "silence-aware-recorder/react";
import { imagesGrid, playAudio } from "./helper";
import conversationApi from "../../api/conversation.api";
import { io } from "socket.io-client";

const INTERVAL = 1000
const SILENCE_DURATION = 2500
const SILENT_THRESHOLD = -30

const SCREEN_IMAGE_WIDTH = 512
const SCREEN_MAX_SCREENSHOTS = 1
const SCREEN_IMAGE_QUALITY = 1
const SCREEN_COLUMNS = 1

const IMAGE_WIDTH = 1080
const MAX_SCREENSHOTS = 30
const IMAGE_QUALITY = 1
const COLUMNS = 4


const VideoChat = () => {
    // const id = useId();
    const maxVolumeRef = useRef(0);
    const minVolumeRef = useRef(-100);
    const isBusy = useRef(false);
    const isScreenShare = useRef(false);
    const screenshotsRef = useRef([]);
    const videoRef = useRef();
    const screenRef = useRef();
    const canvasRef = useRef();
  
    const location = useLocation();
  
    // const { selectedCon, updateConUser } = useContext(ConversationContext);
  
    const [botText, setBotText] = useState("");
    const [displaydebug, setDisplayDebug] = useState(false);
    const [phase, setPhase] = useState("not inited");
    const [transcription, setTranscription] = useState("");
    const [imagesGridUrl, setImagesGridUrl] = useState(null);
    const [currentVolume, setCurrentVolume] = useState(-50);
    const [volumePercentage, setVolumePercentage] = useState(0);
    // const [lang] = useState("en");
    const [isWaiting, setIsWaiting] = useState(false);
  
    const [audioQueue, setAudioQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    // Define recorder for video
    let screenObject = useMediaRecorder({
      recordScreen: true,
      blobOptions: { type: "video/webm" },
      mediaStreamConstraints: { audio: false, video: true },
    });
  
    let { liveStream, ...video } = useMediaRecorder({
      recordScreen: false,
      blobOptions: { type: "video/webm" },
      mediaStreamConstraints: { audio: false, video: true },
    });
  
    
    // Define recorder for audio
    const audio = useSilenceAwareRecorder({
      onDataAvailable: onSpeech,
      onVolumeChange: setCurrentVolume,
      silenceDuration: SILENCE_DURATION,
      silentThreshold: SILENT_THRESHOLD,
      minDecibels: -100,
    });
  
  
  
    // const handleSend = async ({ inputValue, uploadUrl, turnOffWait }) => {
    //   let newImgList = [{
    //     url: uploadUrl,
    //     id: nanoid(),
    //   }];
    //   // API CHAT
    //   const data = {
    //     text: inputValue,
    //     sender: "user",
    //     imgFiles: newImgList.length > 0 ? newImgList : [],
    //     maxToken: 1000
    //   };
    //   const updateStreamText = ({ text }) => {
    //     setBotText(prev => prev + text);
    //   };
    //   const result = await conversationApi.createCamChatStream(
    //     data,
    //     {
    //       updateStreamText, //update stream text
    //       turnOffWait
    //     }
    //   );
    //   console.log("final response: ", result);
    //   return {
    //     content: result.content
    //   };
    // };
    const handleSendClient = async ({ inputValue, frameUrl }) => {
      let isVision = false
      if(frameUrl) isVision = true
      // Retrieve data conversation
      // const { data } = await camApi.getConversation()
      // // Append new message into conversation
  
      // const content = [
      //   { type: "text", text: inputValue },
      //   {
      //     type: "image_url",
      //     image_url: {
      //       "url": uploadUrl,
      //     },
      //   },
      // ]
      // const messages = [
      //   ...data.data,
      //   {
      //     role: "user",
      //     content: content
      //   }
      // ];
  
      // console.log("messages", messages)
      // API CHAT
      const result = await conversationApi.createChat({
        prompt: inputValue,
        uploadUrl: frameUrl
      }, true, isVision);
      console.log("final response: ", result.content);
      setBotText(result.content)
      // const result = await conversationApiV2.createChat(
      //   {inputValue, conversationId:"3cdae64f-b7f9-4326-b94d-3ee34a0af3f5" , base64Data: uploadUrl},
      //   false,
      //   isVision
      // )
      return {
        content: result.content
      };
    };
  
  
  
  
    const toggleScreenShare = (toggle) => {
      isScreenShare.current = toggle;
    };
  
    const recorder = {
      start: (vi, ref) => {
        videoRecorder.start(vi, ref);
        voiceRecorder.start();
      },
      stop: async (vi, ref) => {
        videoRecorder.stop(vi, ref);
        voiceRecorder.stop();
        // video.clearMediaStream()
        // document.location.reload();
      }
    };
  
    const videoRecorder = {
      start: (vi, ref) => {
        if(vi.status === "recording") return;
        console.log("start: video", ref.current);
        vi.startRecording();
      },
      stop: (vi, ref) => {
        if(vi.status === "idle") return;
        vi.stopRecording();
        videoRecorder.stopStreamedVideo(ref.current);
      },
      stopStreamedVideo(videoElem) {
        if (videoElem) {
          const stream = videoElem.srcObject;
          const tracks = stream.getTracks();
  
          tracks.forEach((track) => {
            track.stop();
          });
  
          videoElem.srcObject = null;
        }
      }
    };
  
    const voiceRecorder = {
      start: () => {
        console.log("start: voice");
        audio.startRecording();
        setPhase("user: waiting for speech");
      },
      stop: () => {
        console.log("stop: voice");
        audio.stopRecording();
        setPhase("user: stop meeting");
      },
    };
  
    async function onSpeech(data) {
      try {
        if (isBusy.current) return;
  
        isBusy.current = true;
        audio.stopRecording();
  
        // send audio to whisper
        setPhase("user: processing speech to text");
        setIsWaiting(true);
        setBotText("");
  
        const sttFromData = new FormData();
        sttFromData.append("file", data, "audio.webm");
        // sttFromData.append("language", lang);
  
        const result = await conversationApi.stt(sttFromData);
        console.log("transcript", result.content);

        if (result.content.length > 0) {
          setTranscription(result.content);
  
          const frameUrl = videoRef.current.srcObject !== null ? await videoProcess() : null
          setPhase("user: processing completion");
  
          // send chat
          // const { content } = await handleSend({ uploadUrl: frameUrl[0], inputValue: result.text, turnOffWait: () => {
          //   setIsWaiting(false)
          // } })
          const { content } = await handleSendClient({
            frameUrl: frameUrl,
            inputValue: result.content,
          });
          setIsWaiting(false);
          // const AIresult = "Sure, boss! To return a blob URL from the blob object, you can use the URL.createObjectURL() method. This method creates a DOMString containing a URL representing the object given in the parameter. Here's your updated code:"
          if (content && typeof content === "string") {
            setPhase("assistant: processing text to speech");
  
            const ttsFormData = new FormData();
            ttsFormData.append("input", content);
  
            await conversationApi.tts(content);

            setPhase("assistant: playing audio");
  
            // await playAudio(blobURL);
  
            voiceRecorder.start()
            isBusy.current = false;
          }
        }
        else { // continue recording
          isBusy.current = false;
          voiceRecorder.start();
        }
      } catch (error) {
        console.log(error);
        setIsWaiting(false);
        setPhase("error occur");
  
        // text to speech to announce error
      }
  
    }
  
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
      
      // const uploadUrls = await hostImages([imageUrl]);
  
      setImagesGridUrl(imageUrl);
  
      return imageUrl
    }
    // Socket for streaming response from AI
    useEffect(() => {
      const socket = io('http://192.168.1.7:8001', {
        transports: ['websocket', 'polling'],
      });
  
      socket.on('chatResChunk', ({ content }) => {
          setBotText(content);
      });

      socket.on('audioFile', (filePath) => {
        const audioUrl = URL.createObjectURL(new Blob([filePath], { type: 'audio/mpeg' }));
        
        console.log("audioUrl", audioUrl)
        setAudioQueue((prevQueue) => [...prevQueue, audioUrl]);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

  
      // Clean up the connection on unmount
      return () => {
        socket.disconnect();
      };
    }, []);

  
    useEffect(() => {
      // start record Video + voice
      const initCam = async () => {
        if (location.pathname.includes("/cam")) {
          videoRecorder.start(video, videoRef);
          console.log("init cam")
          // videoRecorder.start(screen, screenRef);
        }
        else {
          recorder.stop(screenObject, screenRef);
          recorder.stop(video, videoRef);
        }
        
      }
      initCam();
      return () => {
        recorder.stop(screenObject, screenRef);
        recorder.stop(video, videoRef);
      };
    }, []);
  
    useEffect(() => {
      if (!audio.isRecording) {
        setVolumePercentage(0);
        return;
      }
  
      if (typeof currentVolume === "number" && isFinite(currentVolume)) {
        if (currentVolume > maxVolumeRef.current)
          maxVolumeRef.current = currentVolume;
        if (currentVolume < minVolumeRef.current)
          minVolumeRef.current = currentVolume;
  
        if (maxVolumeRef.current !== minVolumeRef.current) {
          setVolumePercentage(
            (currentVolume - minVolumeRef.current) / (maxVolumeRef.current - minVolumeRef.current)
          );
        }
      }
    }, [currentVolume, audio.isRecording]);
  
    useEffect(() => {
      const captureFrame = () => {
        if (video.status === "recording" || screenObject.status === "recording" && audio.isRecording) {
          const targetWidth = isScreenShare.current ? SCREEN_IMAGE_WIDTH : IMAGE_WIDTH;
  
          const videoNode = isScreenShare.current ? screenRef.current : videoRef.current;
          
          const canvasNode = canvasRef.current;
  
          if (videoNode && canvasNode) {
            const context = canvasNode.getContext("2d");
            const originalWidth = videoNode.videoWidth;
            const originalHeight = videoNode.videoHeight;
            const aspectRatio = originalHeight / originalWidth;
  
            // Set new width while maintaining aspect ratio
            canvasNode.width = targetWidth;
            canvasNode.height = targetWidth * aspectRatio;
  
            context.drawImage(
              videoNode,
              0,
              0,
              canvasNode.width,
              canvasNode.height
            );
            // Compress and convert image to JPEG format
            const quality = 1; // Adjust the quality as needed, between 0 and 1
            const base64Image = canvasNode.toDataURL("image/jpeg", quality);
  
            if (base64Image !== "data:,") {
              screenshotsRef.current.push(base64Image);
            }
          }
        }
      };
  
      const intervalId = setInterval(captureFrame, INTERVAL);
  
      return () => {
        clearInterval(intervalId);
      };
    }, [video.status, screenObject.status, audio.isRecording, isScreenShare]);
  
    useEffect(() => {
  
      // console.log("------------------------- VIDEO")
      // console.log("ref:",videoRef.current)
      // console.log("livestream", liveStream)
      // console.log("object src: ", videoRef.current.srcObject)
      // console.log("------------------------- END VIDEO")
      if (videoRef.current && liveStream && !videoRef.current.srcObject) {
        videoRef.current.srcObject = liveStream;
        console.log("load video" )
      }
  
  
    }, [liveStream]);
    useEffect(() => {
  
      // console.log("------------------------- SCREEN")
      // console.log("ref:",screenRef.current)
      // console.log("livestream", screenObject.liveStream)
      // console.log("object src: ", screenRef.current.srcObject)
      // console.log("------------------------- END SCREEN")
      if (screenRef.current && screenObject.liveStream && !screenRef.current.srcObject) {
        console.log("load screen")
        screenRef.current.srcObject = screenObject.liveStream;
      }
    }, [screenObject.liveStream]);
  
    // Audio play
    useEffect(() => {
      if (!isPlaying && audioQueue.length > 0) {
        playNextAudio();
      }
    }, [audioQueue, isPlaying]);
  
    const playNextAudio = async () => {
      if (audioQueue.length === 0) {
        setIsPlaying(false);
        return;
      }
  
      setIsPlaying(true);
      const nextAudioUrl = audioQueue[0];
  
      await playAudio(nextAudioUrl);
  
      setAudioQueue((prevQueue) => prevQueue.slice(1));
      setIsPlaying(false);
    };

  const camScreenProp = {
    videoRef,
    screenRef,
    isScreenShare,
    videoRecorder,
    toggleScreenShare,
    volumePercentage,
    audio,
    video,
    screenObject,
    voiceRecorder,
    recorder,
    isBusy,
  };

  const logScreenProp = {
    isWaiting,
    botText,
    setDisplayDebug,
  };
  
  const debugProp = {
    displaydebug, setDisplayDebug,
    imagesGridUrl, transcription,
    phase
  }

  return (
    <Container>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="content">
        <CamScreen {...camScreenProp} />
        <LogScreen {...logScreenProp} />
      </div>

      <DebugLog {...debugProp}/>
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