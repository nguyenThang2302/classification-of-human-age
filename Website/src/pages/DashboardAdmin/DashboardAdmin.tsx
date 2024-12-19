/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Uploads, History, SidebarAdmin, Profile, Search, Download } from '@/components';
import { Trash } from '../Trash';
import Setting from '@/components/Setting/Setting';

function DashboardAdmin() {
  const [selectedSection, setSelectedSection] = useState('uploads');

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
      return <Download />;
    } else if (selectedSection === 'setting') {
      return <Setting />;
    } else if (selectedSection === 'trash-image') {
      return <Trash />;
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
