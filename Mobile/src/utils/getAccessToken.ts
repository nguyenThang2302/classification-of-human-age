import AsyncStorage from '@react-native-async-storage/async-storage';

function getAccessToken() {
    return AsyncStorage.getItem('access_token');
}

export default getAccessToken;
