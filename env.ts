import Constants from "expo-constants";
import { Platform } from "react-native";

const localhost = "http://192.168.1.104:5000";

const ENV = {
 dev: {
    apiUrl: localhost,
    
 },
 staging: {
    apiUrl: 'https://giacominipinturas.herokuapp.com',
 },
 prod: {
    apiUrl: 'https://giacominipinturas.herokuapp.com',
 }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
 // What is __DEV__ ?
 // This variable is set to true when react-native is running in Dev mode.
 // __DEV__ is true when run locally, but false when published.
 if (__DEV__) {
   return ENV.dev;
 } else if (env === 'staging') {
   return ENV.staging;
 } else if (env === 'prod') {
   return ENV.prod;
 }
};

export default getEnvVars;