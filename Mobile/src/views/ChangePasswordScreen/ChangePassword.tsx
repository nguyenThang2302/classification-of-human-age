import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import * as _ from 'lodash';
import Background from '../../components/AuthScreen/Background';
import BackButton from '../../components/AuthScreen/BackButton';
import Header from '../../components/AuthScreen/Header';
import TextInput from '../../components/AuthScreen/TextInput';
import Button from '../../components/AuthScreen/Button';
import { passwordValidator } from '../../helpers/passwordValidator';
import { matchingPasswordValidator } from '../../helpers/matchingPasswordValidator';
import { handleChangePassword } from 'src/services/auth/handleChangePassword';
import Toast from 'react-native-toast-message';

export default function ChangePassword({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState({ value: '', error: '' });
    const [newPassword, setNewPassword] = useState({ value: '', error: '' });
    const [repeatNewPassword, setRepeatNewPassword] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false);

    const changePasswordSubmit = () => {
        setLoading(true);
        const currentPasswordError = passwordValidator(currentPassword.value);
        const newPasswordError = passwordValidator(newPassword.value);
        const repeatNewPasswordError = matchingPasswordValidator(newPassword.value, repeatNewPassword.value);
        if (currentPasswordError || newPasswordError || repeatNewPasswordError) {
            setCurrentPassword({ ...currentPassword, error: currentPasswordError });
            setNewPassword({ ...newPassword, error: newPasswordError });
            setRepeatNewPassword({ ...repeatNewPassword, error: repeatNewPasswordError });
            setLoading(false);
            return
        }

        const requestBody = {
            current_password: currentPassword.value,
            new_password: newPassword.value,
            new_repeat_password: repeatNewPassword.value
        };

        handleChangePassword(requestBody)
            .then(response => {
                if (!_.has(response, 'error')) {
                    Toast.show({
                        type: 'success',
                        text1: '',
                        text2: 'Change password is successfully'
                    });
                    navigation.navigate('ProfileStack');
                }
            })
            .catch(error => {
                Toast.show({
                    type: 'error',
                    text1: '',
                    text2: error.error.message
                });
            }).finally(() => {
                setLoading(false);
            });
    }

    const goProfilePage = () => {
        navigation.replace('ProfileStack');
    };

    return (
        <Background>
            <Header>Change password</Header>
            <TextInput
                label="Current password"
                returnKeyType="done"
                value={currentPassword.value}
                onChangeText={(text) => setCurrentPassword({ value: text, error: '' })}
                error={!!currentPassword.error}
                errorText={currentPassword.error}
                autoCapitalize="none"
                secureTextEntry
            />
            <TextInput
                label="New password"
                returnKeyType="done"
                value={newPassword.value}
                onChangeText={(text) => setNewPassword({ value: text, error: '' })}
                error={!!newPassword.error}
                errorText={newPassword.error}
                secureTextEntry
            />
            <TextInput
                label="Repeat New Password"
                returnKeyType="done"
                value={repeatNewPassword.value}
                onChangeText={(text) => setRepeatNewPassword({ value: text, error: '' })}
                error={!!repeatNewPassword.error}
                errorText={repeatNewPassword.error}
                secureTextEntry
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 16 }} />
            ) : (
                <View>
                    <Button
                        mode="contained"
                        onPress={changePasswordSubmit}
                        style={{ marginTop: 16, width: 200 }}
                    >
                        Verify
                    </Button>
                    <Button
                        mode="contained"
                        onPress={goProfilePage}
                        style={{ marginTop: 16, width: 200 }}
                    >
                        Cancle
                    </Button>
                </View>
            )}
        </Background>
    );
}