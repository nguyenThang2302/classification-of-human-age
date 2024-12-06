import React, { useState } from 'react'
import * as _ from 'lodash';
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/AuthScreen/Background'
import Logo from '../../components/AuthScreen/Logo'
import Header from '../../components/AuthScreen/Header'
import Button from '../../components/AuthScreen/Button'
import TextInput from '../../components/AuthScreen/TextInput'
import { themeAuth } from '../../theme/theme-auth'
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { nameValidator } from '../../helpers/nameValidator'
import { matchingPasswordValidator } from '../../helpers/matchingPasswordValidator';
import { handelRegister } from 'src/services/auth';
import Toast from 'react-native-toast-message';

export default function Register({ navigation }: any) {
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
      repeat_password: repeatPassword.value
    };

    handelRegister(requestBody)
      .then((response) => {
        if (!_.has(response, 'error')) {
          Toast.show({
            type: 'success',
            text1: '',
            text2: 'Register is successfully'
          });
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        }
      })
      .catch((error) => {
        Toast.show({
          type: 'error',
          text1: '',
          text2: error.error.message
        });
      });
  }

  return (
    <Background>
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
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
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: themeAuth.colors.primary,
  },
})