import React, { useState } from "react";
import styled from "styled-components";
import { IoPause } from "react-icons/io5";
import { IoPlay } from "react-icons/io5";
import { motion } from "framer-motion";

// VideoChatPreview Component
const VideoChatPreview = (p) => {
  const { id, videoSrc } = p;
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = (id) => {
    const video = document.getElementById(`video-preview-${id}`);
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnd = (id) => {
    const video = document.getElementById(`video-preview-${id}`);
    video.pause();
    setIsPlaying(false); // Set isPlaying to false when the video ends
  };

  return (
    <VideoContainer>
      <StyledVideo
        id={`video-preview-${id}`} // unique id for each video
        src={videoSrc}
        controls={false} // you can enable default controls if needed
        onClick={() => handlePlayPause(videoSrc)}
        onEnded={() => handleVideoEnd(id)}
      />
      <Controls>
        <PlayPauseButton onClick={() => handlePlayPause(id)} $isPlaying={isPlaying}>
          {isPlaying ? <IoPause /> : <IoPlay />}
        </PlayPauseButton>
      </Controls>
    </VideoContainer>
  );
};

export default VideoChatPreview;


// Play/Pause button styling
const PlayPauseButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20%;


  svg {
    transition: all 0.3s ease;
    visibility: ${props => !props.$isPlaying ? 'visible' : 'hidden'};
    width: 100%;
    height: 100%;
  }

`;


// Video container styling
const VideoContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover ${PlayPauseButton} svg {
    visibility: visible;
  }
`;

// Styled video element
const StyledVideo = styled.video`
  width: 100%;
  border-radius: 10px;
  cursor: pointer;

`;

// Controls for the video, such as play/pause button
const Controls = styled.div`
  position: absolute;
  bottom: 10px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

