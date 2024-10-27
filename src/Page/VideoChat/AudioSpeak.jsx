import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../context/socket.context";
import { playAudio } from "./helper";

const AudioSpeak = (p) => {
    const { recorder, isBusy, setIsWaiting, isOnMic, captureVideo, terminateCaptureVideo } = p
    const [audioQueue, setAudioQueue] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const socket = useContext(WebSocketContext);
  
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
  
  
      // Audio play
      useEffect(() => {
        if (!isPlaying && audioQueue.length > 0) {
          playNextAudio();
        }else if(!isPlaying && audioQueue.length === 0) {
          if(isOnMic) {
            recorder.voice.start()
          }
          setTimeout(async () => {
            await terminateCaptureVideo()
            await captureVideo()
          }, 2000)

          isBusy.current = false;
          setIsWaiting(false);
        }
      }, [audioQueue, isPlaying, isBusy]);
  
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
    
  
    return <></>
  }
  
export default AudioSpeak