import { useEffect, useRef, useState, useContext } from "react";
import styled from "styled-components";

import CamScreen from "./camScreen";
import LogScreen from "./LogScr";
import DebugLog from "./DebugLog";
import { imagesGrid } from "./helper";
import conversationApi from "../../api/conversation.api";
import { WebSocketContext } from "../../Context/socket.context";

export const INTERVAL = 1000
export const SILENCE_DURATION = 2500
export const SILENT_THRESHOLD = -30 

export const SCREEN_IMAGE_WIDTH = 512
export const SCREEN_MAX_SCREENSHOTS = 1
export const SCREEN_IMAGE_QUALITY = 1
export const SCREEN_COLUMNS = 1

export const IMAGE_WIDTH = 1080
export const MAX_SCREENSHOTS = 30
export const IMAGE_QUALITY = 1
export const COLUMNS = 4


const VideoChat = () => {
    // const id = useId();
    const isBusy = useRef(false);
    const isScreenShare = useRef(false);
    const screenshotsRef = useRef([]);
    const videoRef = useRef();
    const canvasRef = useRef();
  
    // const { selectedCon, updateConUser } = useContext(ConversationContext);
  
    const [botText, setBotText] = useState("");
    const [displaydebug, setDisplayDebug] = useState(false);
    const [phase, setPhase] = useState("not inited");
    const [transcription, setTranscription] = useState("");
    const [imagesGridUrl, setImagesGridUrl] = useState(null);
    const [isWaiting, setIsWaiting] = useState(false);
    const socket =  useContext(WebSocketContext);


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
      let result 
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
      try {
        result = await conversationApi.createChat({
          prompt: inputValue,
          uploadUrl: frameUrl
        }, true, isVision);
        console.log("final response: ", result.content);
        setBotText(result.content)
        
      } catch (error) {
        result.content = error.message
      }
      // const result = await conversationApiV2.createChat(
      //   {inputValue, conversationId:"3cdae64f-b7f9-4326-b94d-3ee34a0af3f5" , base64Data: uploadUrl},
      //   false,
      //   isVision
      // )
      return result
    };
   
    async function onSpeech(data) {
      if (isBusy.current) return;
      isBusy.current = true;

      const result = await handleSTT(data)

      if (result.content.length > 0) {
        setTranscription(result.content);

        const frameUrl = videoRef.current.srcObject !== null ? await videoProcess() : null
        setPhase("user: processing completion");

        const { content } = await handleSendClient({
          frameUrl: frameUrl,
          inputValue: result.content,
        });
        setIsWaiting(false);

        await handleTTS(content)
      }
      else { // continue recording
        isBusy.current = false;
        setIsWaiting(false);
        throw new Error
      }
    }

    const handleSTT = async (data) => {
      try {
          // send audio to whisper
          setPhase("user: processing speech to text");
          setIsWaiting(true);
          setBotText("");
    
          const sttFromData = new FormData();
          sttFromData.append("file", data, "audio.webm");
          // sttFromData.append("language", lang);
    
          const result = await conversationApi.stt(sttFromData);
          console.log("transcript", result.content);

          return result
      } catch (error) {
        console.log(error)
        throw error
      }
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
      if(socket){
        socket.on('chatResChunk', ({ content }) => {
            setBotText(content);
        });

      }
  
      // Clean up the connection on unmount
      return () => {
        if(socket) socket.off('chatResChunk');
      };
    }, [socket]);

  const camScreenProp = {
    setPhase,
    onSpeech,
    socket,
    setIsWaiting
  };

  const logScreenProp = {
    isWaiting,
    botText,
    setDisplayDebug,
  };
  
  const debugProp = {
    displaydebug , setDisplayDebug,
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
