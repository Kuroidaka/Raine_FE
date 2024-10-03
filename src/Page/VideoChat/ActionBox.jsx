import styled from "styled-components";

import { Mic, MicOff, Video, VideoOff, Monitor, Phone } from 'react-feather'
import { useState } from "react";


const ActionBox = (p) => {

    const { 
      isBusy,
      recorder,
      video, videoRef,
      screenObject, screenRef, isScreenShare,
      isOnMic, setIsOnMic,
      captureVideo, stopAndSaveCaptureVideo, terminateCaptureVideo,
      stopCall
    } = p
  
    const [isOpenCamBtn, setIsOpenCamBtn] = useState(false)
    const [isScreenBtn, setIsScreenBtn] = useState(false)
  
    const toggleScreenShare = (toggle) => {
      isScreenShare.current = toggle;
    };
  
    const handleEndCall = async () => {
      stopCall()
    };
  
    const cam = {
      open: async () => {
        const videoElm = document.querySelector('.video');
        videoElm.style.display = 'block';
        setIsOpenCamBtn(true);
      
        await recorder.video.start(video, videoRef);
      
        // Wait for videoRef.current.srcObject to be available
        await new Promise((resolve) => {
          const checkSrcObject = () => {
            if (videoRef.current && videoRef.current.srcObject) {
              resolve();  // srcObject is available, proceed
            } else {
              requestAnimationFrame(checkSrcObject);  // Check again on the next animation frame
            }
          };
          checkSrcObject();
        });
      
        // Now that srcObject is available, proceed with capturing the video
        await captureVideo();
      },
      close: async () => {
        await terminateCaptureVideo()
        const videoElm = document.querySelector('.video')
        videoElm.style.display = 'none'
        setIsOpenCamBtn(false)
        console.log("videoRef", videoRef.current.srcObject)
        recorder.video.stop(video, videoRef)
        // stopCaptureVideo()
      },
    }
  
    const screenHandle = {
      open: () => {
        setIsScreenBtn(true)
        recorder.video.start(screenObject, screenRef)
        toggleScreenShare(true)
      },
      close: () => {
        setIsScreenBtn(false)
        recorder.video.stop(screenObject, screenRef)
        toggleScreenShare(false)
      },
    }
  
    const micFunc = {
      open: async () => {
        recorder.voice.start()
        isBusy.current = false
        setIsOnMic(true)
        await captureVideo()

      },
      close: async () => {
        recorder.voice.stop()
        isBusy.current = true
        setIsOnMic(false)
        await terminateCaptureVideo()
      },
    }
  
    return (
      <ActionContainer>
        {isOnMic ? (
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
  
        <BtnWrapper onClick={handleEndCall} className="phone-off" >
            <Phone />
        </BtnWrapper>
      </ActionContainer>
    )
  }


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
export default ActionBox