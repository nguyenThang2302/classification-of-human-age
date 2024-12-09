/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Uploads, History, SidebarAdmin } from '@/components';

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
