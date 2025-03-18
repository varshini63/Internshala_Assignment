import React, { useRef, useEffect, useState } from 'react';

const MainView = ({ 
  zoomLevel, 
  setZoomLevel = () => {}, 
  position, 
  onPositionChange, 
  onViewportResize, 
  detectionResults = [], 
  viewportSize = { width: 0, height: 0 } 
}) => { 
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 1024, height: 512 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/images/blood_sample.png';
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      setImageLoaded(true);
    };
  }, []);


  useEffect(() => {
    if (!imageLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    if (viewportSize && (viewportSize.width !== containerWidth || viewportSize.height !== containerHeight)) {
      if (typeof onViewportResize === 'function') {
        onViewportResize({ width: containerWidth, height: containerHeight });
      }
    }

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = '/images/blood_sample.png';
    img.onload = () => {
      ctx.drawImage(
        img,
        position.x, position.y,
        containerWidth / zoomLevel, containerHeight / zoomLevel,
        0, 0,
        containerWidth, containerHeight
      );
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;

      detectionResults.forEach(([x1, y1, x2, y2]) => {
        const boxX = (x1 - position.x) * zoomLevel;
        const boxY = (y1 - position.y) * zoomLevel;
        const boxWidth = (x2 - x1) * zoomLevel;
        const boxHeight = (y2 - y1) * zoomLevel;
        if (
          boxX + boxWidth >= 0 && 
          boxX <= containerWidth && 
          boxY + boxHeight >= 0 && 
          boxY <= containerHeight
        ) {
          ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        }
      });
    };
  }, [zoomLevel, position, imageLoaded, imageSize, detectionResults, viewportSize, onViewportResize]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = containerRef.current;
    if (!container) return;

    const dx = (e.clientX - dragStart.x) / zoomLevel;
    const dy = (e.clientY - dragStart.y) / zoomLevel;

    const newPosition = {
      x: Math.max(0, Math.min(imageSize.width - container.clientWidth / zoomLevel, position.x - dx)),
      y: Math.max(0, Math.min(imageSize.height - container.clientHeight / zoomLevel, position.y - dy))
    };

    if (typeof onPositionChange === 'function') {
      onPositionChange(newPosition);
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleWheel = (e) => {
    e.preventDefault();
    
    const container = containerRef.current;
    if (!container) return;
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.5, Math.min(3, zoomLevel + delta));

    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const mouseY = e.clientY - containerRect.top;

    const mouseXInImage = position.x + mouseX / zoomLevel;
    const mouseYInImage = position.y + mouseY / zoomLevel;

    const newPosition = {
      x: mouseXInImage - mouseX / newZoom,
      y: mouseYInImage - mouseY / newZoom
    };

    if (typeof onPositionChange === 'function') {
      onPositionChange(newPosition);
    }
    if (typeof setZoomLevel === 'function') {
      setZoomLevel(newZoom);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="main-view"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default MainView;