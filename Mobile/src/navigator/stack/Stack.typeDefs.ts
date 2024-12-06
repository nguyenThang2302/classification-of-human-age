import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList = {
  HomeStack: undefined;
  DetailsStack: { from: string };
  ProfileStack: undefined;
  StartStack: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  HistoryImage: undefined;
  ResetPassword: undefined;
  VerifyForgotCode: undefined;
  Verify2FA: undefined;
  ChangePassword: undefined;
  ChatBot: undefined;
  ChatBotList: undefined;
};

export type StackProps = NativeStackScreenProps<StackParamList, keyof StackParamList>;
