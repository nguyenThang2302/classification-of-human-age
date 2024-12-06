import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import * as _ from 'lodash';
import Background from '../../components/AuthScreen/Background';
import BackButton from '../../components/AuthScreen/BackButton';
import Logo from '../../components/AuthScreen/Logo';
import Header from '../../components/AuthScreen/Header';
import TextInput from '../../components/AuthScreen/TextInput';
import Button from '../../components/AuthScreen/Button';
import { codeValidator } from 'src/helpers/codeValidator';
import Toast from 'react-native-toast-message';
import { handleVerify2FA } from 'src/services/auth/handleVerify2FA';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Verify2FA({ navigation }) {
    const [code2FA, setCode2FA] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false);

    const sendVerify2FA = () => {
        setLoading(true);
        const codeError = codeValidator(code2FA.value);
        if (codeError) {
            setCode2FA({ ...code2FA, error: codeError });
            setLoading(false);
            return;
        };

        const requestBody = {
            secret: '',
            token: code2FA.value
        };

        handleVerify2FA(requestBody)
            .then((response) => {
                if (response.data.data.is_verified) {
                    Toast.show({
                        type: 'success',
                        text1: '',
                        text2: '2FA is verified'
                    });
                    AsyncStorage.removeItem('temp_access_token');
                    AsyncStorage.setItem('access_token', response.data.data.access_token);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Dashboard' }],
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: '',
                        text2: 'Failed to verify 2FA. Please try again.'
                    });
                }
            })
            .catch((error) => {
                console.error('Failed to fetch profile data:', error);
                Toast.show({
                    type: 'error',
                    text1: '',
                    text2: error.error.message
                });
            }).finally(() => setLoading(false));
    }

    return (
        <Background>
            <BackButton goBack={navigation.goBack} />
            <Logo />
            <Header>Please Verify 2FA</Header>
            <TextInput
                label="2FA Code"
                returnKeyType="done"
                value={code2FA.value}
                onChangeText={(text) => setCode2FA({ value: text, error: '' })}
                error={!!code2FA.error}
                errorText={code2FA.error}
                description="You must be use Authenticator app to get the code."
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 16 }} />
            ) : (
                <Button
                    mode="contained"
                    onPress={sendVerify2FA}
                    style={{ marginTop: 16 }}
                >
                    Verify 2FA
                </Button>
            )}
        </Background>
    );
}