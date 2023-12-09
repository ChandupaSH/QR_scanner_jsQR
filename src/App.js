import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';

const QrScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();
  }, []);

  const handleScan = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video.videoWidth || !video.videoHeight) {
      // Wait for video dimensions to be available
      requestAnimationFrame(handleScan);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code) {
      setResult(code.data);
    }

    requestAnimationFrame(handleScan);
  };

  useEffect(() => {
    handleScan();
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {result && <p>QR code scanned: {result}</p>}
    </div>
  );
};

export default QrScanner;
