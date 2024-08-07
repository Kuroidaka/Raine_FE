import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'
import { Mic, MicOff, Video, VideoOff, Monitor, ArrowLeft, Phone } from 'react-feather'
import { useLocation, useNavigate } from "react-router-dom";
import useMediaRecorder from '@wmik/use-media-recorder';
import { IMAGE_WIDTH, INTERVAL, SCREEN_IMAGE_WIDTH, SILENCE_DURATION, SILENT_THRESHOLD } from '.';
import useSilenceAwareRecorder from 'silence-aware-recorder/react';
import { playAudio } from './helper';

// import camApi from "../../api/v1/camConversation";

const CamScreen = (p) => {
  const {
    setPhase,
    onSpeech,
    socket,
    setIsWaiting
  } = p
  
  const [isOpenCamBtn, setIsOpenCamBtn] = useState(true)
  const [isScreenBtn, setIsScreenBtn] = useState(false)
  const [isOnMic, setIsOnMic] = useState(false);

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

      const [currentVolume, setCurrentVolume] = useState(-50);
      const [volumePercentage, setVolumePercentage] = useState(0);
      // const [lang] = useState("en");
      const [audioQueue, setAudioQueue] = useState([]);
      const [isPlaying, setIsPlaying] = useState(false);

  const navigate = useNavigate();


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

  const handleOnSpeech = async (data) => {
    try {
      audio.stopRecording();
      await onSpeech(data)
    } catch (error) {
      setIsWaiting(false);
      setPhase("error occur");
      console.log(error);
      voiceRecorder.start();
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


    const handleClickBack = async () => {
      // camApi.deleteCamChatStream();
        recorder.stop(video, videoRef);
        recorder.stop(screenObject, screenRef);
        navigate("/chat");
    };
  
    const toggleScreenShare = (toggle) => {
      isScreenShare.current = toggle;
    };

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


  const cam = {
    open: () => {
        const videoElm = document.querySelector('.video')
        videoElm.style.display = 'block'
        setIsOpenCamBtn(true)
        videoRecorder.start(video, videoRef)
    },
    close: () => {
        const videoElm = document.querySelector('.video')
        videoElm.style.display = 'none'
        setIsOpenCamBtn(false)
        videoRecorder.stop(video, videoRef)
    },
  }

  const screenHandle = {
    open: () => {
      setIsScreenBtn(true)
      videoRecorder.start(screenObject, screenRef)
      toggleScreenShare(true)
    },
    close: () => {
      setIsScreenBtn(false)
      videoRecorder.stop(screenObject, screenRef)
      toggleScreenShare(false)
    },
  }

  const micFunc = {
    open: () => {
      voiceRecorder.start()
      isBusy.current = false
      setIsOnMic(true)
    },
    close: () => {
      voiceRecorder.stop()
      isBusy.current = true
      setIsOnMic(false)
    },
  }

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
    start: async (vi, ref) => {
      if(vi.status === "recording") return;
      console.log("start: video", ref.current);
      await vi.startRecording();
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

  // INIT CAM
  useEffect(() => {
    // start record Video + voice
    const initCam = async () => {
      if (location.pathname.includes("/cam")) {
        await videoRecorder.start(video, videoRef);
        console.log("init success")
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

  // Audio play
  useEffect(() => {
    if (!isPlaying && audioQueue.length > 0) {
      playNextAudio();
    }else if(!isPlaying && audioQueue.length === 0) {
      voiceRecorder.start()
      isBusy.current = false;
      setIsWaiting(false);
    }
  }, [audioQueue, isPlaying]);


    // Socket for streaming response from AI
    useEffect(() => {

      if(socket){
        socket.on('audioFile', (filePath) => {
          const audioUrl = URL.createObjectURL(new Blob([filePath], { type: 'audio/mpeg' }));
          
          console.log("audioUrl", audioUrl)
          setAudioQueue((prevQueue) => [...prevQueue, audioUrl]);
        });
      }


  
      // Clean up the connection on unmount
      return () => {
        if(socket) socket.off('audioFile');
      };
    }, [socket]);
  

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
        <VideoContainer isScreenShare={isScreenShare.current}>
    
          <video className="screen" ref={screenRef} autoPlay />
    
          <video className="video" ref={videoRef} autoPlay />
    
          <RecordDot
            isrecording={audio.isRecording.toString()}
            volumepercentage={volumePercentage}
          >
            <div>{audio.isRecording ? '' : '⏸'}</div>
          </RecordDot>
          <ActionContainer>
    
            {(isOnMic && !isBusy.current) ? (
                <BtnWrapper onClick={micFunc.close}>
                    <Mic />
                </BtnWrapper>
            ) : (
                <BtnWrapper onClick={micFunc.open} className='off'>
                    <MicOff />
                </BtnWrapper>
            )}
            
            {isOpenCamBtn ? (
            <BtnWrapper onClick={cam.close}>
                <Video />
            </BtnWrapper>
            ) : (
            <BtnWrapper onClick={cam.open} className='off'>
                <VideoOff />
            </BtnWrapper>
            )}
    
            {isScreenBtn ? (
            <BtnWrapper onClick={screenHandle.close} className="monitor">
                <Monitor />
            </BtnWrapper>
            ) : (
            <BtnWrapper onClick={screenHandle.open} >
                <Monitor />
            </BtnWrapper>
            )}

            <BtnWrapper onClick={handleClickBack} className="phone-off" >
                <Phone />
            </BtnWrapper>
          </ActionContainer>
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

  ${(props) =>
    props.isScreenShare &&
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

  ${(props) =>
    !props.isScreenShare &&
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
  z-index: 99999;
  cursor: ${(props) => (props.isrecording === 'true' ? 'default' : 'pointer')};

  ${(props) =>
    props.isrecording &&
    css`
      div {
        width: 4rem;
        height: 4rem;
        background-color: #f56565;
        opacity: 0.5;
        border-radius: 50%;
        transform: scale(${Math.pow(props.volumepercentage, 4).toFixed(4)});
      }
    `}

  ${(props) =>
    props.isrecording === 'false' &&
    css`
      div {
        font-size: 3.125rem;
        color: #f56565;
        opacity: 0.5;
      }
    `}
`

const ActionContainer = styled.div`
    width: 100%;
    height: 100px;
    position: absolute;
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
    bottom: 0;
`

const BtnWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    height: 50px;
    width: 50px;
    background-color: #6a6a6a;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: #898181; 
    }

    &.off {
        background-color: #e95353;
        &:hover {
            background-color: #f56565; 
        }
    }

    &.monitor {
        background-color: #3b82f6;
        &:hover {
            background-color: #2563eb; 
        }
    }

    &.phone-off {
        background-color: #EA4335;
        width: 70px;
        border-radius: 27px;
        svg {
            rotate: 135deg;
        }
    }
`