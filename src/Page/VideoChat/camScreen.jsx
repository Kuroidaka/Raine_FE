import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'
import { ArrowLeft } from 'react-feather'
import {  useNavigate } from "react-router-dom";
import useMediaRecorder from '@wmik/use-media-recorder';

import useSilenceAwareRecorder from 'silence-aware-recorder/react';
import conversationApi from '../../api/conversation.api';
import { toast } from 'react-toastify';
import ActionBox from './ActionBox';
import AudioSpeak from './AudioSpeak';
import { IMAGE_WIDTH, INTERVAL, SCREEN_IMAGE_WIDTH, SILENCE_DURATION, SILENT_THRESHOLD } from './constant';

const CamScreen = (p) => {
  const {
    setPhase,
    setIsWaiting,
    canvasRef,
    setBotText,
    isBusy,
    videoRef,
    isScreenShare,
    screenshotsRef,
    captureVideo, stopAndSaveCaptureVideo, terminateCaptureVideo,
    handleProcessAI,
    conID
  } = p

    const maxVolumeRef = useRef(0);
    const minVolumeRef = useRef(-100);
    
    const screenRef = useRef(null);

    const [currentVolume, setCurrentVolume] = useState(-50);
    const [volumePercentage, setVolumePercentage] = useState(0);
    const [isOnMic, setIsOnMic] = useState(false);
    

    const navigate = useNavigate();


    // Define recorder for screen share
    let screenObject = useMediaRecorder({
      recordScreen: true,
      blobOptions: { type: "video/webm" },
      mediaStreamConstraints: { audio: false, video: true },
    });
    // Define recorder for video
    let { liveStream, ...video } = useMediaRecorder({
      recordScreen: false,
      blobOptions: { type: "video/webm" },
      mediaStreamConstraints: { audio: false, video: true },
    });


    async function onSpeech(data) { //User say
      if (isBusy.current) return;
      isBusy.current = true;
      console.log("data", URL.createObjectURL(data))
      // const audioUrl = URL.createObjectURL(new Blob([filePath], { type: 'audio/mpeg' }));
      
      const result = await handleSTT(data)

      if (result.content.length > 0) {
        await handleProcessAI(result.content)
      }
      else { // continue recording
        isBusy.current = false;
        setIsWaiting(false);
        recorder.voice.start();
      }
    }

    const handleOnSpeech = async (data) => {
      try {
        audio.stopRecording();
        await onSpeech(data)        
      } catch (error) {
        console.log(error)
        isBusy.current = false;
        setIsWaiting(false);
        // recorder.voice.start();
        toast.error("error occur while chatting")
      }
    }

    const handleSTT = async (data) => {
      try {
          // send audio to whisper
          setPhase("user: processing speech to text");
          setIsWaiting(true);
          setBotText("");
    
          const sttFromData = new FormData();
          sttFromData.append("file", data, "audio.mp3");
    
          const result = await conversationApi.stt(sttFromData);
          console.log("transcript", result.content);

          return result
      } catch (error) {
        console.log(error)
        throw error
      }
    }



    // Define recorder for audio
    const audio = useSilenceAwareRecorder({
      onDataAvailable: handleOnSpeech,
      onVolumeChange: setCurrentVolume,
      silenceDuration: SILENCE_DURATION,
      silentThreshold: SILENT_THRESHOLD,
      minDecibels: -100,
    });

    const stopCall = async () => {
      await terminateCaptureVideo()
      recorder.hardStop(video, videoRef);
      recorder.hardStop(screenObject, screenRef);
      if(conID.current) {
        navigate(`/chat/${conID.current}`);  
      }
      else {
        navigate("/chat");
      }
    }

    const handleClickBack = async () => {
      // camApi.deleteCamChatStream();
      stopCall()
    };
  

    const recorder = {
      hartStart: (vi, ref) => {
        recorder.video.start(vi, ref);
        recorder.voice.start();
      },
      hardStop: async (vi, ref) => {
        recorder.video.stop(vi, ref);
        recorder.voice.stop();
        // video.clearMediaStream();
        // document.location.reload();
      },
      video: {
        start: async (vi) => {
          if (vi.status === "recording") return;
          // console.log(ref.current);
          await vi.startRecording();
        },
        stop: (vi, ref) => {
          if (vi.status === "idle") return;
          vi.stopRecording();
          recorder.video.stopStreamedVideo(ref.current);
        },
        stopStreamedVideo: (videoElem) => {
          console.log("videoElem?.srcObject", videoElem?.srcObject)
          if (videoElem?.srcObject) {
            const stream = videoElem.srcObject;
            const tracks = stream.getTracks();
    
            tracks.forEach((track) => {
              track.stop();
            });
            videoElem.srcObject = null;
            // console.log("videoElem.srcObject", videoElem.srcObject)
          }
        }
      },
      voice: {
        start: () => {
          audio.startRecording();
          setPhase("user: waiting for speech");
        },
        stop: () => {
          audio.stopRecording();
          setPhase("user: stop meeting");
        }
      }
    };




  // Process frame capture
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
  }, [video.status, screenObject.status, audio.isRecording, isScreenShare, canvasRef, videoRef]);

  // Initialize video and screen streams
  useEffect(() => {
    if (videoRef.current && liveStream && !videoRef.current.srcObject) {
      videoRef.current.srcObject = liveStream;
      console.log("load cam");
    }

    if (screenRef.current && screenObject.liveStream && !screenRef.current.srcObject) {
      screenRef.current.srcObject = screenObject.liveStream;
      console.log("load screen");
    }
  }, [liveStream, screenObject.liveStream, videoRef]);

  // Start and stop recording based on the location
  // useEffect(() => {
  //   const initCam = async () => {
  //     if (location.pathname.includes("/cam")) {
  //       await recorder.video.start(video, videoRef);
  //       console.log("init success");
  //     }
  //   };

  //   initCam();

  //   return () => {
  //     recorder.hardStop(screenObject, screenRef);
  //     recorder.hardStop(video, videoRef);
  //   };
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.pathname, screenObject, video]);


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


  const audioProps= {
    recorder, isBusy, setIsWaiting, isOnMic, captureVideo
  }
  const actionProps= {
    isBusy,
    recorder,
    video, videoRef,
    screenObject, screenRef, isScreenShare,
    isOnMic, setIsOnMic,
    captureVideo, stopAndSaveCaptureVideo, terminateCaptureVideo,
    stopCall
  }


  return (
  <VideoSection>
        <motion.div
            className='title'
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}>
            <motion.div className='back-icon' onClick={handleClickBack}>
            <ArrowLeft />
            </motion.div>
        </motion.div>
        <VideoContainer $isScreenShare={isScreenShare.current.toString()}>
          <video className="screen" ref={screenRef} autoPlay />
          <video className="video" ref={videoRef} autoPlay />
          <RecordDot
            $isRecording={audio.isRecording.toString()}
            $volumePercentage={volumePercentage}
          >
            <div>{audio.isRecording ? '' : '⏸'}</div>
          </RecordDot>
          <ActionBox {...actionProps}/>
          <AudioSpeak {...audioProps}/>
        </VideoContainer>
  </VideoSection>
  )
}

export default CamScreen

const VideoSection = styled.div `
    height: 100%;
    width: 80%;
`

const VideoContainer = styled.div`
  flex-direction: column;
  width: 100%;
  background-color: black;
  height: 92%;
  position: relative;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  video {
    width: 100%;
    border-radius: 0.5rem;
    flex: 1;
  }

  .screen {
    display: none;
  }

  ${({ $isScreenShare }) =>
    $isScreenShare === 'true' &&
    css`
      .screen {
        width: 100%;
        height: 100%;
        display: block;
      }

      .video {
        position: absolute;
        left: 0;
        height: auto;
        top: -10px;
        width: 20%;
        border: 2px solid #6288d0;
      }
    `}

  ${({ $isScreenShare }) =>
    $isScreenShare === 'false' &&
    css`
      .video {
        width: 100%;
        height: 100%;
        display: block;
      }
    `}
`
const RecordDot = styled.div`
  width: 4rem;
  height: 4rem;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 400;
  cursor: ${({ $isRecording }) => ($isRecording === 'true' ? 'default' : 'pointer')};

  ${({ $isRecording, $volumePercentage }) =>
    $isRecording === 'true' &&
    css`
      div {
        width: 4rem;
        height: 4rem;
        background-color: #f56565;
        opacity: 0.5;
        border-radius: 50%;
        transform: scale(${Math.pow($volumePercentage, 4).toFixed(4)});
      }
    `}

  ${({ $isRecording }) =>
    $isRecording === 'false' &&
    css`
      div {
        font-size: 3.125rem;
        color: #f56565;
        opacity: 0.5;
      }
    `}
`

