import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

export function Footer({ navigation, onShowHistory, onShowHome, onShowProfile }: any) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={onShowHome} style={styles.button}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios/50/home--v1.png' }}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onShowHistory} style={styles.button}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios/50/activity-history.png' }}
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onShowProfile} style={styles.button}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios/50/guest-male.png' }}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    padding: 10,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
