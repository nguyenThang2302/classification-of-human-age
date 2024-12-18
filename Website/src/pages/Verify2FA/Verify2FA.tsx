import React, { useState } from "react";
import "../Verify2FA/Verify2FA.css";
import { code2FAValidator } from '@/helpers/code2FaValidator';
import { handleVerify2FA } from "@/services/auth/handleVerify2FA";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const VerifyCode2FA = () => {
  const navigate = useNavigate();

  const [code2FA, setCode2FA] = useState({ value: '', error: '' });

  const handleSubmit = async () => {
    const codeError = code2FAValidator(code2FA.value);
    if (codeError) {
      setCode2FA({ ...code2FA, error: codeError });
      return;
    }
    const body = {
      secret: '',
      token: code2FA.value,
    };
    try {
      const response = await handleVerify2FA(body);
      if (response.data.data.is_verified) {
        localStorage.removeItem('temp_access_token');
        localStorage.setItem('access_token', response.data.data.access_token);
        navigate('/dashboard');
        toast.success('Login successfully');
      } else {
        toast.warning('Code 2FA is invalid. Please try again');
        setCode2FA({ value: '', error: '' });
      }
    } catch (e: any) {
      toast.error(e.error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="verify-form">
        <h2>Verify 2FA Code</h2>
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code2FA.value}
          onChange={(e) => setCode2FA({ value: e.target.value, error: '' })}
          className="verify-input"
        />
        <div>
          {code2FA.error && (
            <span className="error-message">
              {code2FA.error}
            </span>
          )}
        </div>
        <button type="submit" onClick={() => handleSubmit()} style={{ marginTop: '10px', backgroundColor: '#0069d9', borderColor: '#0062cc' }} className="verify-button">
          Vefiry
        </button>
      </div>
    </div>
  );
};

export default VerifyCode2FA;
