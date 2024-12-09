/* eslint-disable prettier/prettier */
import React from 'react';
import '../SideBar/SideBar.css';
import { FaUpload } from 'react-icons/fa';

const SidebarAdmin = ({ onMenuClick }: any) => {
  return (
    <div className="sidebar">
      <button onClick={() => onMenuClick('uploads')}>
        <FaUpload style={{ marginRight: '8px' }} />
        Convert
      </button>
      <button onClick={() => onMenuClick('history')}>Admin</button>
    </div>
  );
};

export default SidebarAdmin;
