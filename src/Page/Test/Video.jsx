import React, { useRef, useState } from 'react';
import testApi from '../../api/test.api';
import { compressBase64Data } from '../../Util';
const PhotoCapture = () => {
  const [photo, setPhoto] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing the camera:', error);
    }
  };

  const capturePhoto = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas to a data URL
      let dataUrl = canvas.toDataURL('image/jpeg');
      console.log("dataUrl", dataUrl)
      dataUrl = compressBase64Data(dataUrl)
      
      console.log("dataUrl", dataUrl)
      // console.log('Data URL:', dataUrl);
      await testApi.describeImage(dataUrl)
      // Optionally convert to a Blob and log the file
    //   canvas.toBlob(blob => {
    //     if (blob) {
    //       console.log('Blob:', blob);
    //       setPhoto(URL.createObjectURL(blob)); // Set photo for potential display or download
    //     }
    //   }, 'image/jpeg');
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: '100%' }}></video>
      <button onClick={capturePhoto}>Capture Photo</button>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      {photo && <img src={photo} alt="Captured" />}
    </div>
  );
};

export default PhotoCapture;