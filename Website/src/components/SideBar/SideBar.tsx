/* eslint-disable prettier/prettier */
import React from 'react';
import './Sidebar.css';
import { FaUpload } from 'react-icons/fa';

const Sidebar = ({ onMenuClick }: any) => {
  return (
    <div className="sidebar">
      <button onClick={() => onMenuClick('uploads')}>
        <FaUpload style={{ marginRight: '8px' }} />
        Convert
      </button>
      <button onClick={() => onMenuClick('history')}>History</button>
    </div>
  );
};

export default Sidebar;
