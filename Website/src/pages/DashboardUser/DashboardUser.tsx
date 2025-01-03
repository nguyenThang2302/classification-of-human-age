/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Uploads, History, Sidebar, Profile } from '@/components';
import Setting from '@/components/Setting/Setting';

function DashboardUser() {
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
    } else if (selectedSection === 'setting') {
      return <Setting />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar onMenuClick={setSelectedSection} />
      <div className="content">{renderSection()}</div>
    </div>
  );
}

export default DashboardUser;
