import React from 'react';
import { StyleSheet, TextProps } from 'react-native';
import { Text } from 'react-native-paper';
import { themeAuth } from '../../theme/theme-auth';

type HeaderProps = TextProps;

const Header: React.FC<HeaderProps> = (props) => {
  return <Text style={styles.header} {...props} />;
};

const styles = StyleSheet.create({
  header: {
    fontSize: 21,
    color: themeAuth.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
});

export default Header;
