/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Uploads, History, SidebarAdmin, Profile, Search, Download } from '@/components';
import { useNavigate } from "react-router-dom";

function DashboardAdmin() {
  const [selectedSection, setSelectedSection] = useState('uploads');
  const navigate = useNavigate();

  const renderSection = () => {
    if (selectedSection === 'uploads') {
      return <Uploads />;
    } else if (selectedSection === 'history') {
      return <History />;
    } else if (selectedSection === 'logout') {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } else if (selectedSection === 'profile') {
      return <Profile />;
    } else if (selectedSection === 'search-image') {
      return <Search />;
    } else if (selectedSection === 'download-image') {
      // navigate('/download-images');
      return <Download />;
    }
  };

  return (
    <div className="dashboard">
      <SidebarAdmin onMenuClick={setSelectedSection} />
      <div className="content">{renderSection()}</div>
    </div>
  );
}

export default DashboardAdmin;
