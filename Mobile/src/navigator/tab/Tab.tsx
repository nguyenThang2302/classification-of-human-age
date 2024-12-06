import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { colors } from '@theme';
import { TabParamList, TabBarStatus } from './Tab.typeDefs';
import { HomeStackNavigator, ProfileStackNavigator, HistoryImageNavigatior, ChatBotNavigatior } from '../stack/Stack';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator<TabParamList>();

const renderTabBarIcon = (tabName: keyof TabParamList) => (tabStatus: TabBarStatus) => {
  switch (tabName) {
    case 'HomeTab':
      return <AntDesign name="home" size={24} color={tabStatus.color} />;
    case 'HistoryImageTab':
      return <MaterialIcons name="history" size={24} color={tabStatus.color} />;
    case 'ProfileTab':
      return <AntDesign name="profile" size={24} color={tabStatus.color} />;
    case 'ChatBotTab':
      return <MaterialIcons name="chat" size={24} color={tabStatus.color} />;
  }
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: renderTabBarIcon(route.name),
        headerShown: false,
        tabBarInactiveTintColor: colors.gray,
        tabBarInactiveBackgroundColor: colors.white,
        tabBarActiveTintColor: colors.lightPurple,
        tabBarActiveBackgroundColor: colors.white,
        unmountOnBlur: true
      })}>
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="HistoryImageTab" component={HistoryImageNavigatior} options={{ title: 'History' }} />
      <Tab.Screen name="ChatBotTab" component={ChatBotNavigatior} options={{ title: 'ChatBot' }} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
