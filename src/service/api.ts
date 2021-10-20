import axios from 'axios';
import { signout } from "../helpers/auth";
import Constants from 'expo-constants';
import {Restart} from 'fiction-expo-restart';

const api = axios.create({
  baseURL: Constants.manifest.extra.url+'/api'
});

api.interceptors.response.use(
  response => Promise.resolve(response),
  error => errorHandler(error)
);

const errorHandler = (error) => {
  if (error?.response?.status == 401) {
    alert('Sessão expirada.');
    setTimeout(function() { 
      signout();
      Restart(); 
    }, 1000);
  }
  return Promise.reject(error);
}

export default api;
