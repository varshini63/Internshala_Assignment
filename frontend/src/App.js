import React, { useState, useCallback } from 'react';
import MainView from './components/MainView';
import LeftPanel from './components/LeftPanel';
import HubView from './components/HubView';
import ZoomControls from './components/ZoomControls';
import detectionResults from './data/detection_results';
import './App.css';

function App() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 600 });

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.2, 0.5));
  };

  const handlePan = (newPosition) => {
    setPosition(newPosition);
  };

  const handleViewportResize = useCallback((size) => {
    setViewportSize(prevSize => {
      if (prevSize.width === size.width && prevSize.height === size.height) {
        return prevSize; 
      }
      return size; 
    });
  }, []);

  return (
    <div className="app-container">
      <div className="left-panel">
        <LeftPanel patientId="7" sampleType="blood" date="2024-12-09" />
      </div>
      <div className="main-content">
        <div className="top-panel">
          <HubView
            position={position}
            zoomLevel={zoomLevel}
            viewportSize={viewportSize}
            detectionResults={detectionResults}
            onPositionChange={handlePan}
          />
          <ZoomControls 
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        </div>
        <div className="main-view-container">
          <MainView
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            position={position}
            onPositionChange={handlePan}
            onViewportResize={handleViewportResize}
            detectionResults={detectionResults}
            viewportSize={viewportSize}
          />
        </div>
      </div>
    </div>
  );
}

export default App;