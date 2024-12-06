import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import * as _ from 'lodash';
import Background from '../../components/AuthScreen/Background';
import BackButton from '../../components/AuthScreen/BackButton';
import Logo from '../../components/AuthScreen/Logo';
import Header from '../../components/AuthScreen/Header';
import TextInput from '../../components/AuthScreen/TextInput';
import Button from '../../components/AuthScreen/Button';
import { passwordValidator } from '../../helpers/passwordValidator';
import { codeValidator } from 'src/helpers/codeValidator';
import { handleVerifyCode } from 'src/services/auth/handleVerifyCode';
import { matchingPasswordValidator } from '../../helpers/matchingPasswordValidator';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyForgotCode({ navigation }) {
  const [code, setCode] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [repeatPassword, setRepeatPassword] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(false);

  const VerifyCode = () => {
    setLoading(true);
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

    handleVerifyCode(requestBody)
      .then(response => {
        if (!_.has(response, 'error')) {
            Toast.show({
                type: 'success',
                text1: '',
                text2: 'Change password is successfully'
            });
            AsyncStorage.removeItem('forgot_email');
            AsyncStorage.removeItem('forgot_token');
            navigation.navigate('Login');
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
      <Header>Verification Code</Header>
      <TextInput
        label="Code-6digits"
        returnKeyType="done"
        value={code.value}
        onChangeText={(text) => setCode({ value: text, error: '' })}
        error={!!code.error}
        errorText={code.error}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Repeat Password"
        returnKeyType="done"
        value={repeatPassword.value}
        onChangeText={(text) => setRepeatPassword({ value: text, error: '' })}
        error={!!repeatPassword.error}
        errorText={repeatPassword.error}
        secureTextEntry
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 16 }} />
      ) : (
        <Button
          mode="contained"
          onPress={VerifyCode}
          style={{ marginTop: 16 }}
        >
          Verify
        </Button>
      )}
    </Background>
  );
}