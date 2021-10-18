import axios from 'axios';
import Constants from 'expo-constants';

class LoginService {
    login(loginData) {
        return axios.post(Constants.manifest.extra.url+'/login', loginData);
    }
}

export default new LoginService();