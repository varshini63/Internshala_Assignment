import React, { useRef, useEffect } from 'react';

const HubView = ({ position, zoomLevel, viewportSize, detectionResults, onPositionChange }) => {
  const canvasRef = useRef(null);
  const imageSize = { width: 1024, height: 512 }; 
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = '/images/blood_sample.png';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.lineWidth = 1;
      
      detectionResults.forEach(([x1, y1, x2, y2]) => {
        const scaleX = canvas.width / imageSize.width;
        const scaleY = canvas.height / imageSize.height;
        
        const boxX = x1 * scaleX;
        const boxY = y1 * scaleY;
        const boxWidth = (x2 - x1) * scaleX;
        const boxHeight = (y2 - y1) * scaleY;
        
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
      });
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      
      const viewX = position.x * canvas.width / imageSize.width;
      const viewY = position.y * canvas.height / imageSize.height;
      const viewWidth = (viewportSize.width / zoomLevel) * canvas.width / imageSize.width;
      const viewHeight = (viewportSize.height / zoomLevel) * canvas.height / imageSize.height;
      
      ctx.strokeRect(viewX, viewY, viewWidth, viewHeight);
    };
  }, [position, zoomLevel, viewportSize, detectionResults]);

  const handleHubClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const imageX = (x / canvas.width) * imageSize.width;
    const imageY = (y / canvas.height) * imageSize.height;
    const newX = Math.max(0, imageX - (viewportSize.width / zoomLevel / 2));
    const newY = Math.max(0, imageY - (viewportSize.height / zoomLevel / 2));
    
    onPositionChange({ x: newX, y: newY });
  };

  return (
    <div className="hub-view">
      <h3>Hub View</h3>
      <canvas 
        ref={canvasRef} 
        width={200} 
        height={100} 
        onClick={handleHubClick}
      />
    </div>
  );
};

export default HubView;