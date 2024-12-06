import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackParamList } from './Stack.typeDefs';
import { DrawerProps } from '../drawer/Drawer.typeDefs';
import { StackHeaderTitle } from './components';
import { colors } from '@theme';

// views
import Home from '@views/Home';
import Profile from '@views/ProfileScreen/Profile';
import Start from '@views/StartScreen/Start';
import Login from '@views/LoginScreen/Login';
import Register from '@views/RegisterScreen/Register';
import TabNavigator from '@navigator/tab';
import HistoryImage from '@views/HistoryImageScreen/HistoryImage';
import ResetPassword from '@views/ResetPasswordScreen/ResetPassword';
import VerifyForgotCode from '@views/VerifyForgotCodeScreen/VerifyForgotCode';
import Verify2FA from '@views/Verify2FAScreen/Verify2FA';
import ChangePassword from '@views/ChangePasswordScreen/ChangePassword';
import ChatBot from '@views/ChatBotScreen/ChatBot';
import ChatBotList from '@views/ChatBotScreen/ChatBotList';

const Stack = createNativeStackNavigator<StackParamList>();

const navigationProps = {
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.darkPurple },
  headerTitleStyle: { fontSize: 18 },
};

export function HomeStackNavigator({ navigation }: DrawerProps) {
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <Stack.Screen
        component={Home}
        name="HomeStack"
        options={{
          title: 'Home',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

export function HistoryImageNavigatior({ navigation }: DrawerProps) {
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <Stack.Screen
        component={HistoryImage}
        name="HistoryImage"
        options={{
          title: 'HistoryImage',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

export function ChatBotNavigatior({ navigation }: DrawerProps) {
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <Stack.Screen
        component={ChatBotList}
        name="ChatBotList"
        options={{
          title: 'ChatBot',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={ChatBot}
        name="ChatBot"
        options={{
          title: 'ChatBot',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
}

export function StartStackNavigator({ navigation }: DrawerProps) {
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <Stack.Screen
        component={Start}
        name="StartStack"
      />
      <Stack.Screen
        component={Login}
        name="Login"
      />
      <Stack.Screen
        component={Register}
        name="Register"
      />
      <Stack.Screen
        component={ResetPassword}
        name="ResetPassword"
      />
      <Stack.Screen
        component={VerifyForgotCode}
        name="VerifyForgotCode"
      />
      <Stack.Screen
        component={Verify2FA}
        name="Verify2FA"
      />
      <Stack.Screen
        component={TabNavigator}
        name="Dashboard"
      />
    </Stack.Navigator>
  );
}

export function ProfileStackNavigator({ navigation }: DrawerProps) {
  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <Stack.Screen
        component={Profile}
        name="ProfileStack"
        options={{
          title: 'Profile',
          headerTitle: () => <StackHeaderTitle />,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        component={Start}
        name="StartStack"
      />
      <Stack.Screen
        component={ChangePassword}
        name="ChangePassword"
      />
    </Stack.Navigator>
  );
}
