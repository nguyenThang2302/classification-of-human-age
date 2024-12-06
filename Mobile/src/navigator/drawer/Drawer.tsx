import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from '../tab/Tab';
import { DrawerParamList } from './Drawer.typeDefs';
import { StartStackNavigator } from '@navigator/stack';
import getAccessToken from '@utils/getAccessToken';
import isTokenExpired from '@utils/validatorToken';
import * as _ from 'lodash';

const Drawer = createDrawerNavigator<DrawerParamList>();

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

const drawerContents = () => (
  <SafeAreaView>
    <View style={styles.root}>
      <Text>Side Menu Contents</Text>
    </View>
  </SafeAreaView>
);

function DrawerNavigator() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessToken();
        setAccessToken(token);
      } catch (error) {
        console.error('Error fetching access token:', error);
      }
    };

    fetchAccessToken();
  }, []);

  if (_.isUndefined(accessToken) || isTokenExpired(accessToken)) {
    return (
      <Drawer.Navigator
        initialRouteName="MainDrawer"
        screenOptions={{ headerShown: false }}
        drawerContent={drawerContents}>
        <Drawer.Screen name="MainDrawer" component={StartStackNavigator} />
      </Drawer.Navigator>
    );
  }
  return (
    <Drawer.Navigator
      initialRouteName="MainDrawer"
      screenOptions={{ headerShown: false }}
      drawerContent={drawerContents}>
      <Drawer.Screen name="MainDrawer" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
