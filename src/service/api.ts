import axios from 'axios';
import { getToken, signout } from "../helpers/auth";
import getEnvVars from '../../env';
const { apiUrl } = getEnvVars();

const api = axios.create({
  baseURL: apiUrl+'/api'
});

api.interceptors.response.use(
  response => Promise.resolve(response),
  error => errorHandler(error)
);

const errorHandler = (error) => {
  console.log(error);
  if (typeof error === 'string' && error?.indexOf('401') > 0 || error?.response?.status === 401) signout();
  
  return Promise.reject(error);
}

export default api;
