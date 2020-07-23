import axios from 'axios';
import getEnvVars from '../../env';
//const { apiUrl } = getEnvVars();
import Constants from 'expo-constants';

class LoginService {
    login(facebookData) {
        return axios.post(Constants.manifest.extra.url+'/facebooklogin', {accessToken: facebookData.accessToken});
    };

    facebookData(accessToken) {
        return axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
    }
}

export default new LoginService();