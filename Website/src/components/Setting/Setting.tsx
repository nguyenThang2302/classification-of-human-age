import React from 'react';
import ChangePassword from '../Setting/ChangePassword';
import Enable2FA from '../Setting/Enable2FA';
import '../Setting/Setting.css';

const Setting = () => {
  return (
    <div className="setting-page">
      <h2>Settings</h2>
      <ChangePassword />
      <Enable2FA />
    </div>
  );
};

export default Setting;
