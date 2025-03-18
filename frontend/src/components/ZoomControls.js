import React from 'react';

const ZoomControls = ({ zoomLevel, onZoomIn, onZoomOut }) => {
  return (
    <div className="zoom-controls">
      <button className="zoom-button" onClick={onZoomOut}>-</button>
      <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
      <button className="zoom-button" onClick={onZoomIn}>+</button>
    </div>
  );
};

export default ZoomControls;