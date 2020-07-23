import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useAuth } from "../contexts/auth";
import { RootStackParamList } from '../../types';
import * as Facebook from 'expo-facebook';
import LoginService from '../service/auth';
import logo from '../../assets/images/logo.png'; 

export default function Login({navigation}: StackScreenProps<RootStackParamList, 'Login'>) {

  const { login } = useAuth();

  async function handleSign() {
    try {
      await Facebook.initializeAsync('3115359865198631');
      const responseFB = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (responseFB.type === 'success') {  
            
        LoginService.login({accessToken: responseFB.token})
          .then(res => {
            LoginService.facebookData(responseFB.token).then(dataFB => {
              login({data: res.data, facebook: dataFB.data}, (user:any) => {
                if (user) {
                  navigation.navigate('Root');
                }
              });
            });         
        });
        
        
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

    
  return (
    <View style={styles.container}>
      <Image
        style={{ width: '100%', height: 200, marginBottom: 20 }}
        source={logo}
      />
      <Text style={styles.title}>GIACOMINI PINTURAS</Text>
      <TouchableOpacity onPress={handleSign} style={styles.loginBtn}>
        <Text style={{ color: "#fff" }}>ENTRAR COM O FACEBOOK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  loginBtn: {
    marginTop: 15,
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
});
