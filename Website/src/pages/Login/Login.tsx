/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as _ from 'lodash';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import './style.css';
import { emailValidator, passwordValidator } from '../../helpers';
import { handleLogin } from '../../services/auth';
import { toast } from 'react-toastify';


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    const requestBody = {
      email: email.value,
      password: password.value,
    };

    handleLogin(requestBody)
      .then(response => {
        if (response.data.data.is_enable_2fa) {
          localStorage.setItem('temp_access_token', response.data.data.access_token);
          navigate('/verify-2fa');
        } else {
          toast.success('Login successfully');
          localStorage.setItem('access_token', response.data.data.access_token);
          navigate('/dashboard');
        }
      })
      .catch(e => {
        toast.error(e.error.message);
      });
  }

  return (
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <MDBCard className='bg-white my-5 mx-auto' style={{borderRadius: '1rem', maxWidth: '500px'}}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>

              <h2 className="fw-bold mb-2 text-center">Sign in</h2>
              <p className="text-white-50 mb-3">Please enter your login and password!</p>

              <MDBInput wrapperClass='mb-4 w-100' label='Email address' id='formControlLg' type='email' size="lg" value={email.value} onChange={(e) => setEmail({ value: e.target.value, error: '' })}/>
              {email.error && (
                <span className="error-message">
                  {email.error}
                </span>
              )}
              <MDBInput wrapperClass='mb-4 w-100' label='Password' id='formControlLg' type='password' size="lg" value={password.value} onChange={(e) => setPassword({ value: e.target.value, error: '' })}/>
              {password.error && (
                <span className="error-message">
                  {password.error}
                </span>
              )}

              <MDBCheckbox name='flexCheck' id='flexCheckDefault' className='mb-4' label='Remember password' />

              <MDBBtn size='lg' onClick={onLoginPressed}>
                Sign in
              </MDBBtn>

              <hr className="my-4" />
              <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Don't have an account? <a href="/register" style={{color: '#393f81'}}>Register here</a></p>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default Login;
