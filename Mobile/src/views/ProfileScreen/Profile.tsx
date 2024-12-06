import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import TextInput from '../../components/AuthScreen/TextInput'
import Background from '../../components/DashboardScreen/Background';
import { fetchProfileData } from 'src/services/user/getProfile';
import { handleEnable2FA } from 'src/services/auth/handleEnable2FA';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/AuthScreen/Button';
import { handleSubmitEnable2FA } from 'src/services/auth/handleSubmitEnable2FA';
import { handleDisable2FA } from 'src/services/auth/handleDisable2FA';
import { codeValidator } from 'src/helpers/codeValidator';
import Toast from 'react-native-toast-message';

type data2FA = {
  secret: string;
  url: string;
};

export default function Profile({ navigation }: any) {
  const [userData, setUserData] = useState<any>(null);
  const [code2FA, setCode2FA] = useState({ value: '', error: '' });
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [data2FA, setData2FA] = useState<data2FA | null>(null);
  const [isShowInput2FA, setIsShowInput2FA] = useState(false);

  useEffect(() => {
    fetchProfileData()
      .then((response) => {
        if (response.data) {
          setIs2FAEnabled(response.data.data.is_2fa_enabled);
          setUserData(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch profile data:', error);
      }).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem('access_token');
    navigation.replace('Login');
  };

  const enable2FA = () => {
    if (is2FAEnabled) {
      setIs2FAEnabled(false);
      setData2FA(null);
      setIsShowInput2FA(true);
      return;
    } else {
      setIs2FAEnabled(true);
    }
    handleEnable2FA()
      .then((response) => {
        if (response.data) {
          setData2FA(response.data.data);
          console.log(response.data.data);
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
  };

  const submitCode2FA = () => {
    const codeError = codeValidator(code2FA.value);
    if (codeError) {
      setCode2FA({ ...code2FA, error: codeError });
      return;
    };

    const requestBody = {
      secret: data2FA?.secret || '',
      token: code2FA.value,
    };

    handleSubmitEnable2FA(requestBody)
      .then((response) => {
        if (response.data) {
          console.log(response.data.data);
          if (response.data.data.is_verified) {
            setIs2FAEnabled(true);
            setData2FA(null);
            Toast.show({
              type: 'success',
              text1: '',
              text2: '2FA is enabled'
            });
          } else {
            Toast.show({
              type: 'error',
              text1: '',
              text2: 'Token is valid'
            });
          }
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
  };

  const submitDisable2FA = () => {
    const codeError = codeValidator(code2FA.value);
    if (codeError) {
      setCode2FA({ ...code2FA, error: codeError });
      return;
    };

    const requestBody = {
      secret: '',
      token: code2FA.value,
    };

    handleDisable2FA(requestBody)
      .then((response) => {
        if (response.data) {
          if (response.data.data.is_disabled) {
            setIs2FAEnabled(false);
            setIsShowInput2FA(false);
            Toast.show({
              type: 'success',
              text1: '',
              text2: '2FA is disabled'
            });
          } else {
            Toast.show({
              type: 'error',
              text1: '',
              text2: 'Failed to disable 2FA'
            });
          }
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
  };

  const goChagePasswordPage = () => {
    navigation.replace('ChangePassword');
  };

  return (
    <Background>
      {loading ? (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        userData && (
          <View style={styles.container}>
            <Image source={{ uri: 'https://res.cloudinary.com/dxsdyc667/image/upload/v1725939410/udtt7a2uwjbr2pupjnfb.jpg' }} style={styles.avatar} />

            <Text style={styles.label}>{userData.name}</Text>

            <Text style={styles.label}>{userData.email}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.label}>Enable 2FA: </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={userData.is_2fa_enabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={enable2FA}
                value={is2FAEnabled}
              />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.label}>Password: </Text>
              <Button
                mode="contained"
                style={{ width: 80, height: 50}}
                onPress={goChagePasswordPage}
              >
                Edit
              </Button>
            </View>
            {data2FA && (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={{ uri: data2FA?.url }} style={styles.imageQR} />
                <Text style={styles.label} selectable={true}>{data2FA?.secret}</Text>
                <View>
                  <TextInput
                    style={{ height: 1 }}
                    returnKeyType="next"
                    value={code2FA.value}
                    onChangeText={(text) => setCode2FA({ value: text, error: '' })}
                    error={!!code2FA.error}
                    errorText={code2FA.error}
                    description="You must be use Authenticator app to get the code. Please scan the QR code or fill the secret key above."
                  />
                  <View>
                    <Button
                      mode="contained"
                      style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center' }}
                      onPress={submitCode2FA}
                    >
                      Enable2FA
                    </Button>
                  </View>
                </View>
              </View>
            )}
            {isShowInput2FA && (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View>
                  <TextInput
                    style={{ height: 1 }}
                    returnKeyType="next"
                    value={code2FA.value}
                    onChangeText={(text) => setCode2FA({ value: text, error: '' })}
                    error={!!code2FA.error}
                    errorText={code2FA.error}
                    description="You must be use Authenticator app to get the code. Please scan the QR code or fill the secret key above."
                  />
                  <View>
                    <Button
                      mode="contained"
                      style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center' }}
                      onPress={submitDisable2FA}
                    >
                      Disable 2FA
                    </Button>
                  </View>
                </View>
              </View>
            )}
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
              <View style={styles.buttonContent}>
                <Image
                  source={{ uri: 'https://img.icons8.com/color/48/exit.png' }}
                  style={styles.icon}
                />
                <Text style={styles.buttonText}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      )}
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    padding: 10,
    width: 150,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  imageQR: {
    width: 200,
    height: 200
  }
});
