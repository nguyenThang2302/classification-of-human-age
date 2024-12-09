/* eslint-disable prettier/prettier */
import React from 'react';
import '../SideBar/SideBar.css';
import { FaUpload, FaSignOutAlt } from 'react-icons/fa';

const SidebarAdmin = ({ onMenuClick }: any) => {
  return (
    <div className="sidebar">
      <button onClick={() => onMenuClick('uploads')}>
        <FaUpload style={{ marginRight: '8px' }} />
        Convert
      </button>
      <button onClick={() => onMenuClick('history')}>Admin</button>
      <button onClick={() => onMenuClick('logout')}>
        <FaSignOutAlt style={{ marginRight: '8px' }} />
        Logout
      </button>
    </div>
  );
};

export default SidebarAdmin;
