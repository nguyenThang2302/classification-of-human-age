import React, { useState } from "react";
import "../Verify2FA/Verify2FA.css";
import { code2FAValidator } from '@/helpers/code2FaValidator';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { emailValidator } from "@/helpers/emailValidator";
import { handleForgotPassword } from "@/services/auth/handleForgotPassword";
import { passwordValidator } from "@/helpers/passwordValidator";
import { matchingPasswordValidator } from "@/helpers/matchingPasswordValidator";
import { codeValidator } from "@/helpers/codeValidator";
import { handleVerifyCode } from "@/services/auth/handleVerifyCode";

const VerifyForgotCode = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [repeatPassword, setRepeatPassword] = useState({ value: '', error: '' });

  const handleSubmit = async () => {
    const codeError = codeValidator(code.value);
    const passwordError = passwordValidator(password.value);
    const repeatPasswordError = matchingPasswordValidator(password.value, repeatPassword.value);
    if (codeError || passwordError || repeatPasswordError) {
      setCode({ ...code, error: codeError });
      setPassword({ ...password, error: passwordError });
      setRepeatPassword({ ...repeatPassword, error: repeatPasswordError });
      return
    }

    const requestBody = {
      code: code.value,
      password: password.value,
      repeat_password: repeatPassword.value
    };

    try {
      await handleVerifyCode(requestBody);
      localStorage.removeItem('forgot_email');
      localStorage.removeItem('forgot_token');
      navigate('/login');
      toast.success('Reset password successfully');
    } catch (e: any) {
      toast.warn(e.error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="verify-form">
        <h2>Verify code forgot password</h2>
        <input
          type="text"
          placeholder="Enter your forgot code"
          value={code.value}
          onChange={(e) => setCode({ value: e.target.value, error: '' })}
          className="verify-input"
        />
        <div>
          {code.error && (
            <span className="error-message">
              {code.error}
            </span>
          )}
        </div>
        <input
          type="password"
          placeholder="Enter your new password"
          value={password.value}
          onChange={(e) => setPassword({ value: e.target.value, error: '' })}
          className="verify-input"
        />
        <div>
          {password.error && (
            <span className="error-message">
              {password.error}
            </span>
          )}
        </div>
        <input
          type="password"
          placeholder="Enter your new confirm password"
          value={repeatPassword.value}
          onChange={(e) => setRepeatPassword({ value: e.target.value, error: '' })}
          className="verify-input"
        />
        <div>
          {repeatPassword.error && (
            <span className="error-message">
              {repeatPassword.error}
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

export default VerifyForgotCode;
