import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import * as _ from 'lodash';
import Background from '../../components/AuthScreen/Background';
import BackButton from '../../components/AuthScreen/BackButton';
import Logo from '../../components/AuthScreen/Logo';
import Header from '../../components/AuthScreen/Header';
import TextInput from '../../components/AuthScreen/TextInput';
import Button from '../../components/AuthScreen/Button';
import { emailValidator } from '../../helpers/emailValidator';
import { handleForgotPassword } from 'src/services/auth/handleForgotPassword';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResetPassword({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);

  const sendResetPasswordEmail = () => {
    setLoading(true);
    const emailError = emailValidator(email.value)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }

    const requestBody = {
      email: email.value
    };

    handleForgotPassword(requestBody)
      .then(response => {
        if (!_.has(response, 'error')) {
          AsyncStorage.setItem('forgot_email', email.value);
          AsyncStorage.setItem('forgot_token', response.data.data.forgot_token);
          navigation.navigate('VerifyForgotCode');
        }
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: '',
          text2: error.error.message
        });
      }).finally(() => {
        setLoading(false);
      });
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Forgot Password</Header>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive email with code forgot password."
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 16 }} />
      ) : (
        <Button
          mode="contained"
          onPress={sendResetPasswordEmail}
          style={{ marginTop: 16 }}
        >
          Send email
        </Button>
      )}
    </Background>
  );
}