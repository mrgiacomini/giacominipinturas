import AsyncStorage from '@react-native-community/async-storage';
import api from "../service/api";

export const authenticate = async (response: any, next: any) => {
    api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    await AsyncStorage.setItem('token', response.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(response));
    next(response);
};

export const isAuth = async () => {
    let token;
    try {
        token = await AsyncStorage.getItem('token');
        if (token !== 'undefined') {
            api.defaults.headers.Authorization = `Bearer ${token}`;
            const user = await AsyncStorage.getItem('user');
            if (user)
                return JSON.parse(user);           
        }
      } catch (e) {
        console.log(e);
      }
    return false;
};

export const signout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
};