import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input, TextInputProps } from 'react-native-paper';
import { themeAuth } from '../../theme/theme-auth';

type TextInputComponentProps = TextInputProps & {
  errorText?: string;
  description?: string;
};

const TextInput: React.FC<TextInputComponentProps> = ({ errorText, description, ...props }) => {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        selectionColor={themeAuth.colors.primary}
        underlineColor="transparent"
        mode="outlined"
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: themeAuth.colors.surface,
  },
  description: {
    fontSize: 13,
    color: themeAuth.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: themeAuth.colors.error,
    paddingTop: 8,
  },
});

export default TextInput;
