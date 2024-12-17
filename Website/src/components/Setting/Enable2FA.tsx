import React, { useEffect, useState } from 'react';
import * as _ from 'lodash';
import '../Setting/Enable2FA.css';
import { useSession } from '@/hooks';
import ReactSwitch from 'react-switch';
import { handleEnable2FA } from '@/services/auth/handleEnable2FA';
import { IoCloseCircle } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';
import { code2FAValidator } from '@/helpers/code2FaValidator';
import { handleSubmitEnable2FA } from '@/services/auth/handleSubmitEnable2FA';
import { toast } from 'react-toastify';
import { fetchProfileData } from '@/services/user/getProfile';
import { handleDisable2FA } from '@/services/auth/handleDisable2FA';

type Enable2FADetails = {
  secret: string;
  url: string;
};

type UserProfile = {
  name: string;
  email: string;
  is_2fa_enabled: boolean;
}

const Enable2FA = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [is2FADisabled, setIs2FADisabled] = useState(false);
  const [isEnableToggle, setIsEnableToggle] = useState(false);

  useEffect(() => {
    fetchProfileData()
      .then((response) => {
        if (response.data) {
          setUserProfile(response.data.data);
          setIs2FAEnabled(response.data.data.is_2fa_enabled);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch profile data:', error);
      });
  }, []);

  const [enable2FADetails, setEnable2FADetails] = useState<Enable2FADetails | null>(null);
  const [code2FA, setCode2FA] = useState({ value: '', error: '' });

  const handleToggle2FA = async () => {
    setIs2FAEnabled(!is2FAEnabled);
    setIsEnableToggle(!isEnableToggle);
    if (is2FAEnabled) {
      setIs2FADisabled(true);
      return;
    }
    try {
      const response = await handleEnable2FA();
      setEnable2FADetails(response.data.data);
      setCode2FA({ value: '', error: '' });
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSubmit2FACode = async () => {
    const codeError = code2FAValidator(code2FA.value);
    if (codeError) {
      setCode2FA({ ...code2FA, error: codeError });
      return;
    }
    try {
      const body = {
        secret: enable2FADetails?.secret || '',
        token: code2FA.value,
      }
      const response = await handleSubmitEnable2FA(body);
      if (response.data.data.is_verified) {
        toast.success('Enable Two-Factor Authentication is successfully');
        setIs2FAEnabled(true);
        setEnable2FADetails(null);
        setCode2FA({ value: '', error: '' });
        setIsEnableToggle(!isEnableToggle);
      }
    } catch (e: any) {
      toast.error(e.error.message);
    }
  };

  const handleSubmitDisable2FA = async () => {
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
      const response = await handleDisable2FA(body);
      if (response.data.data.is_disabled) {
        toast.success('Disable Two-Factor Authentication is successfully');
        setEnable2FADetails(null);
        setCode2FA({ value: '', error: '' });
        setIs2FADisabled(false);
        setIsEnableToggle(!isEnableToggle);
      }
    } catch (e: any) {
      toast.error(e.error.message);
    }
  };

  const handleCancle2FA = () => {
    setEnable2FADetails(null);
    setIs2FAEnabled(!is2FAEnabled);
    setCode2FA({ value: '', error: '' });
    setIsEnableToggle(!isEnableToggle);
  };

  const handleCancleDisable2FA = () => {
    setCode2FA({ value: '', error: '' });
    setIs2FADisabled(false);
    setIs2FAEnabled(!is2FAEnabled);
    setIsEnableToggle(!isEnableToggle);
  };

  return (
    <div className="enable-2fa">
      <h3>Two-Factor Authentication</h3>
      {userProfile && (
        <>
          <p>{is2FAEnabled ? 'Setting of 2FA is enabled' : 'Setting of 2FA is disabled'}</p>
          <ReactSwitch
            offColor="#888"
            onColor='#080'
            onChange={handleToggle2FA}
            checked={is2FAEnabled}
            disabled={isEnableToggle}
            id="2fa-switch"
          />
        </>
      )}
      {enable2FADetails && (
        <div style={{ textAlign: 'center' }}>
          <img
            src={enable2FADetails?.url}
            alt="Scanned"
            style={{ display: 'block', margin: '0 auto' }}
          />
          <p>{enable2FADetails?.secret}</p>
          <input
            type='text'
            value={code2FA.value}
            onChange={(e) => setCode2FA({ value: e.target.value, error: '' })}>
          </input>
          <span>
            You must be use Authenticator app to get the code. Please scan the QR code or fill the secret key above.
          </span>
          <div>
            {code2FA.error && (
              <span className="error-message">
                {code2FA.error}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end"
            }}
          >
            <button className="btn-search" onClick={() => handleCancle2FA()} style={{ marginTop: '10px', marginRight: '10px', backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
              <IoCloseCircle style={{ marginRight: '8px' }} />
              Cancle
            </button>
            <button className="btn-search" onClick={() => handleSubmit2FACode()} style={{ marginTop: '10px', backgroundColor: '#0069d9', borderColor: '#0062cc' }}>
              <FaSave style={{ marginRight: '8px' }} />
              Save
            </button>
          </div>
        </div>
      )}
      {is2FADisabled && (
        <>
          <input type='text'
            value={code2FA.value}
            onChange={(e) => setCode2FA({ value: e.target.value, error: '' })}>
          </input>
          <span>
            You must be use Authenticator app to get the code. Please scan the QR code or fill the secret key above.
          </span>
          <div>
            {code2FA.error && (
              <span className="error-message">
                {code2FA.error}
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end"
            }}
          >
            <button className="btn-search" onClick={() => handleCancleDisable2FA()} style={{ marginTop: '10px', marginRight: '10px', backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
              <IoCloseCircle style={{ marginRight: '8px' }} />
              Cancle
            </button>
            <button className="btn-search" onClick={() => handleSubmitDisable2FA()} style={{ marginTop: '10px', backgroundColor: '#0069d9', borderColor: '#0062cc' }}>
              <FaSave style={{ marginRight: '8px' }} />
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Enable2FA;
