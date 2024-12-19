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
}
  from 'mdb-react-ui-kit';
import './style.css';
import { emailValidator, matchingPasswordValidator, nameValidator, passwordValidator } from '../../helpers';
import { handelRegister } from '@/services/auth';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [repeatPassword, setRepeatPassword] = useState({ value: '', error: '' });

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const repeatPasswordError = matchingPasswordValidator(password.value, repeatPassword.value);
    if (emailError || passwordError || nameError || repeatPasswordError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      setRepeatPassword({ ...repeatPassword, error: repeatPasswordError })
      return
    }

    const requestBody = {
      name: name.value,
      email: email.value,
      password: password.value,
      repeat_password: repeatPassword.value,
    };

    handelRegister(requestBody)
      .then((response) => {
        if (!_.has(response, 'error')) {
          toast.success('Register successfully');
          navigate('/login');
        }
      })
      .catch((e) => {
        toast.error(e.error.message);
      });
  }

  return (
    <MDBContainer fluid>

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>

          <MDBCard className='bg-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '500px' }}>
            <MDBCardBody className='p-5 w-100 d-flex flex-column'>

              <h2 className="fw-bold mb-2 text-center">Sign up</h2>
              <p className="text-white-50 mb-3">Please enter your login and password!</p>

              <MDBInput wrapperClass='mb-4 w-100' label='Email address' id='formControlLg' type='email' size="lg" value={email.value} onChange={(e) => setEmail({ value: e.target.value, error: '' })} />
              {email.error && (
                <span className="error-message">
                  {email.error}
                </span>
              )}
              <MDBInput wrapperClass='mb-4 w-100' label='Name' id='formControlLg' type='name' size="lg" value={name.value} onChange={(e) => setName({ value: e.target.value, error: '' })} />
              {name.error && (
                <span className="error-message">
                  {name.error}
                </span>
              )}
              <MDBInput wrapperClass='mb-4 w-100' label='Password' id='formControlLg' type='password' size="lg" value={password.value} onChange={(e) => setPassword({ value: e.target.value, error: '' })} />
              {password.error && (
                <span className="error-message">
                  {password.error}
                </span>
              )}
              <MDBInput wrapperClass='mb-4 w-100' label='Repeat password' id='formControlLg' type='password' size="lg" value={repeatPassword.value} onChange={(e) => setRepeatPassword({ value: e.target.value, error: '' })} />
              {repeatPassword.error && (
                <span className="error-message">
                  {repeatPassword.error}
                </span>
              )}

              <MDBBtn size='lg' onClick={onSignUpPressed}>
                Sign up
              </MDBBtn>

              <hr className="my-4" />
              <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Do have an account? <a href="/login" style={{ color: '#393f81' }}>Login here</a></p>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>
  );
}

export default Register;
