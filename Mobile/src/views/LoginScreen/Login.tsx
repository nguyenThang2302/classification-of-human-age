import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import * as _ from 'lodash';
import { Text } from 'react-native-paper';
import Background from '../../components/AuthScreen/Background';
import Logo from '../../components/AuthScreen/Logo';
import Header from '../../components/AuthScreen/Header';
import Button from '../../components/AuthScreen/Button';
import TextInput from '../../components/AuthScreen/TextInput';
import { themeAuth } from '../../theme/theme-auth';
import { emailValidator } from '../../helpers/emailValidator';
import { passwordValidator } from '../../helpers/passwordValidator';
import { handleLogin } from '../../services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function Login({ navigation }: any) {
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
        if (!_.has(response, 'error')) {
          if (response.data.data.is_enable_2fa) {
            AsyncStorage.setItem('temp_access_token', response.data.data.access_token);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Verify2FA' }],
            });
          } else {
            Toast.show({
              type: 'success',
              text1: '',
              text2: 'Login is successfully'
            });
            AsyncStorage.setItem('access_token', response.data.data.access_token);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
          }
        }
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: '',
          text2: error.error.message
        });
      });
  };

  return (
    <Background>
      <Logo />
      <Header>VeggieClassify Application</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Register')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: themeAuth.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: themeAuth.colors.primary,
  },
});
