import React, { useState } from "react";
import "../Verify2FA/Verify2FA.css";
import { code2FAValidator } from '@/helpers/code2FaValidator';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { emailValidator } from "@/helpers/emailValidator";
import { handleForgotPassword } from "@/services/auth/handleForgotPassword";

const ForgotPassowrd = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState({ value: '', error: '' });

  const handleSubmit = async () => {
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }

    const requestBody = {
      email: email.value
    };

    try {
      const response = await handleForgotPassword(requestBody);
      localStorage.setItem('forgot_email', email.value);
      localStorage.setItem('forgot_token', response.data.data.forgot_token);
      navigate('/verify-forgot-code');
      toast.success('Send code successfully. Please check your email');
    } catch (e: any) {
      toast.warn(e.error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="verify-form">
        <h2>Send code forgot password</h2>
        <input
          type="text"
          placeholder="Enter your email"
          value={email.value}
          onChange={(e) => setEmail({ value: e.target.value, error: '' })}
          className="verify-input"
        />
        <div>
          {email.error && (
            <span className="error-message">
              {email.error}
            </span>
          )}
        </div>
        <button type="submit" onClick={() => handleSubmit()} style={{ marginTop: '10px', backgroundColor: '#0069d9', borderColor: '#0062cc' }} className="verify-button">
          Send code
        </button>
      </div>
    </div>
  );
};

export default ForgotPassowrd;
