/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import '../SideBar/SideBar.css';
import { FaBook, FaAngleDoubleDown, FaAngleDoubleUp, FaSignOutAlt, FaUser, FaSearch, FaUpload, FaHistory, FaDownload } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

const SidebarAdmin = ({ onMenuClick }: any) => {
  const [isSubMenuVisible, setIsSubMenuVisible] = useState(false);
  const [isClickManagementItem, setIsClickManagementItem] = useState(false);

  const onClickManagementItem = () => {
    setIsClickManagementItem(!isClickManagementItem);
    setIsSubMenuVisible(!isSubMenuVisible);
  };

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
      <button onClick={() => onClickManagementItem()}>
        <FaBook style={{ marginRight: '8px' }} />
        Managements
        {isClickManagementItem ? <FaAngleDoubleUp style={{ marginLeft: '60px' }} /> : <FaAngleDoubleDown style={{ marginLeft: '60px' }} />}
      </button>
      {isSubMenuVisible && (
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <ul style={{listStyleType: 'none',}}>
            <li>
              <button onClick={() => onMenuClick('search-image')}>
                <FaSearch style={{ marginRight: '8px' }} />
                Search image
              </button>
            </li>
            <li>
              <button onClick={() => onMenuClick('download-image')}>
                <FaDownload style={{ marginRight: '8px' }} />
                Download images
              </button>
            </li>
          </ul>
        </div>
      )}
      <button onClick={() => onMenuClick('profile')}>
        <FaUser style={{ marginRight: '8px' }} />
        Profile
      </button>
      <button onClick={() => onMenuClick('setting')}>
        <IoMdSettings style={{ marginRight: '8px' }} />
        Setting
      </button>
      <button onClick={() => onMenuClick('logout')}>
        <FaSignOutAlt style={{ marginRight: '8px' }} />
        Logout
      </button>
    </div>
  );
};

export default SidebarAdmin;
