import React from 'react';
import { StyleSheet, TextProps } from 'react-native';
import { Text } from 'react-native-paper';

type ParagraphProps = TextProps;

const Paragraph: React.FC<ParagraphProps> = (props) => {
  return <Text style={styles.text} {...props} />;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default Paragraph;
