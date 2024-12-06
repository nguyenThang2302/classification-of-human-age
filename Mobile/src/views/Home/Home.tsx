import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import Background from '../../components/DashboardScreen/Background';
import { StackProps } from '@navigator/stack';
import Camera from '@views/CameraScreen/Camera';
import Upload from '@views/UploadImages/Upload';
import { colors } from '@theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrayPurple,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonTitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 22,
    backgroundColor: colors.lightPurple,
    height: 44,
    width: '50%',
  },
});

export default function Home({ navigation }: StackProps) {
  return (
    <View style={styles.root}>
      <Background>
        <Camera/>
      </Background>
    </View>
  );
}
