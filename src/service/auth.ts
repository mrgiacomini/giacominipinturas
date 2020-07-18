import axios from 'axios';
import getEnvVars from '../../env';
const { apiUrl } = getEnvVars();

class LoginService {
    login(facebookData) {
        return axios.post(apiUrl+'/facebooklogin', {accessToken: facebookData.accessToken});
    };

    facebookData(accessToken) {
        return axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`);
    }
}

export default new LoginService();