/* eslint-disable prettier/prettier */
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onMenuClick }) => {
  return (
    <div className="sidebar">
      <button onClick={() => onMenuClick('uploads')}>
        Uploads
      </button>
      <button onClick={() => onMenuClick('history')}>History</button>
    </div>
  );
};

export default Sidebar;
