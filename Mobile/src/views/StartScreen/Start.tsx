import React from 'react'
import Background from '../../components/AuthScreen/Background'
import Logo from '../../components/AuthScreen/Logo'
import Header from '../../components/AuthScreen/Header'
import Button from '../../components/AuthScreen/Button'
import Paragraph from '../../components/AuthScreen/Paragraph'


export default function Start({ navigation }: any) {
  return (
    <Background>
      <Logo />
      <Header>VeggieClassify Application</Header>
      <Paragraph>
        The easiest way to start with your amazing application.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Login')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Register')}
      >
        Sign Up
      </Button>
    </Background>
  )
}
