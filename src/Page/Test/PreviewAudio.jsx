import React, { useState, useRef } from 'react';

const AudioPreview = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const audioRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/webm')) {
      setAudioFile(URL.createObjectURL(file));
      setFileType(file.type);
    } else {
      alert('Please select a valid MP3 or WEBM audio file');
    }
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {audioFile && (
        <>
          <button onClick={handlePlayAudio}>Play Audio</button>
          <audio ref={audioRef} controls>
            <source src={audioFile} type={fileType} />
            Your browser does not support the audio element.
          </audio>
        </>
      )}
    </div>
  );
};

export default AudioPreview;
