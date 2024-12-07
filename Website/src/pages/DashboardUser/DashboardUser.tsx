/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Uploads, History, Sidebar } from '@/components';

function DashboardUser() {
  const [selectedSection, setSelectedSection] = useState('uploads');

  const renderSection = () => {
    if (selectedSection === 'uploads') {
      return <Uploads />;
    } else if (selectedSection === 'history') {
      return <History />;
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
