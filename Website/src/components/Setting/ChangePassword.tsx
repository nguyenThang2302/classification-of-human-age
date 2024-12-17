import React, { useState } from 'react';
import * as _ from 'lodash';
import '../Setting/ChangePassword.css';
import { IoCloseCircle } from 'react-icons/io5';
import { matchingPasswordValidator, passwordValidator } from '../../helpers';
import { toast } from 'react-toastify';
import { handleChangePassword } from '@/services/auth/handleChangePassword';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState({ value: '', error: '' });
  const [newPassword, setNewPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const currentPasswordError = passwordValidator(currentPassword.value);
    const newPasswordError = passwordValidator(newPassword.value);
    const confirmPasswordError = matchingPasswordValidator(newPassword.value, confirmPassword.value);
    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      setCurrentPassword({ ...currentPassword, error: currentPasswordError })
      setNewPassword({ ...newPassword, error: newPasswordError })
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError })
      return
    }
    const body = {
      current_password: currentPassword.value,
      new_password: newPassword.value,
      new_repeat_password: confirmPassword.value,
    };
    try {
      const response = await handleChangePassword(body);
      if (_.has(response, 'data')) {
        toast.success('Password changed successfully');
      }
    } catch (e: any) {
      toast.error(e.error.message);
    }
    setShowModal(false);
    setCurrentPassword({ value: '', error: '' });
    setNewPassword({ value: '', error: '' });
    setConfirmPassword({ value: '', error: '' });
  };

  const handleShowModel = () => {
    setShowModal(true);
  };

  const handleCloseModel = () => {
    setCurrentPassword({ value: '', error: '' });
    setNewPassword({ value: '', error: '' });
    setConfirmPassword({ value: '', error: '' });
    setShowModal(false);
  }

  return (
    <div className="change-password">
      <h3>Change Password</h3>
      <button onClick={() => handleShowModel()}>Change Password</button>
      {showModal && (
        <div
          style={{
            height: "50%",
            width: "50%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            zIndex: 10,
            overflow: "hidden",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end"
            }}
          >
            <button className="btn-search" onClick={() => handleCloseModel()} style={{ marginBottom: "10px", backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
              <IoCloseCircle style={{ marginRight: '8px' }} />
              Close
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <label>
              Current Password:
              <input
                type="password"
                value={currentPassword.value}
                onChange={(e) => setCurrentPassword({ value: e.target.value, error: '' })}
              />
              {currentPassword.error && (
                <span className="error-message">
                  {currentPassword.error}
                </span>
              )}
            </label>
            <label>
              New Password:
              <input
                type="password"
                value={newPassword.value}
                onChange={(e) => setNewPassword({ value: e.target.value, error: '' })}
              />
              {newPassword.error && (
                <span className="error-message">
                  {newPassword.error}
                </span>
              )}
            </label>
            <label>
              Confirm New Password:
              <input
                type="password"
                value={confirmPassword.value}
                onChange={(e) => setConfirmPassword({ value: e.target.value, error: '' })}
              />
              {confirmPassword.error && (
                <span className="error-message">
                  {confirmPassword.error}
                </span>
              )}
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end"
              }}
            >
              <button type="submit">Change Password</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
