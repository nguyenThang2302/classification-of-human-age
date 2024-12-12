/* eslint-disable prettier/prettier */
import React from 'react';
import '../SideBar/SideBar.css';
import { FaUpload, FaSignOutAlt, FaUser, FaHistory } from 'react-icons/fa';

const Sidebar = ({ onMenuClick }: any) => {
  return (
    <div className="sidebar">
      <button onClick={() => onMenuClick('uploads')}>
        <FaUpload style={{ marginRight: '8px' }} />
        Convert
      </button>
      <button onClick={() => onMenuClick('history')}>
        <FaHistory style={{ marginRight: '8px' }} />
        History
      </button>
      <button onClick={() => onMenuClick('profile')}>
        <FaUser style={{ marginRight: '8px' }} />
        Profile
      </button>
      <button onClick={() => onMenuClick('logout')}>
        <FaSignOutAlt style={{ marginRight: '8px' }} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
