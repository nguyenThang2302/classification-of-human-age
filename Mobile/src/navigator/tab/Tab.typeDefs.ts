import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TabBarStatus = {
  focused: boolean;
  color: string;
  size: number;
};

export type TabParamList = {
  HomeTab: undefined;
  ProfileTab: undefined;
  HistoryImageTab: undefined;
  ChatBotTab: undefined;
};

export type TabProps = BottomTabScreenProps<TabParamList, keyof TabParamList>;
