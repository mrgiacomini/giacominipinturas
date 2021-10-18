import { StackScreenProps } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useAuth } from "../contexts/auth";
import { RootStackParamList } from '../../types';
import LoginService from '../service/auth';
import logo from '../../assets/images/logo.png'; 
import * as LocalAuthentication from 'expo-local-authentication'

export default function Login({navigation}: StackScreenProps<RootStackParamList, 'Login'>) {
  const {height, width} = Dimensions.get('window');

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isBiometricAvailable)
      return alert('Aparelho sem biometria disponível');

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alert('Nenhuma biometria salva.');

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Entrar com Biometria',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: true,
    }); 

    if (biometricAuth.success) {
      setLoading(true);
      const loginData = {email: email};
      LoginService.login(loginData)
          .then((res: any) => {
              login({data: res.data}, (user:any) => {
                setLoading(false);
                if (user) {
                  navigation.navigate('Root');
                }
              });    
        }).catch((error: any) => {            
          setLoading(false);
          alert(error?.response?.data?.error);
        });
    }
  };
    
  return (
    <>
    {loading ?
      <View
        style={{justifyContent: 'center', alignItems: 'center', height, width}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      :
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={logo}
        />
        <Text style={styles.title}>GIACOMINI PINTURAS</Text>
        <TextInput        
          placeholder={'Digite seu email'}
          value={email}
          onChangeText={setEmail}
          autoCompleteType={"email"}
          keyboardType={"email-address"}
          style={styles.input}
          autoCapitalize="none"          
        />
        <TouchableOpacity onPress={handleBiometricAuth} style={styles.loginBtn}>
          <Text style={styles.loginBtnText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>      
    }
    </>
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
  loginBtnText: {
    color: "#fff"
  },
  logo: { 
    width: '100%', 
    height: 200, 
    marginBottom: 20 
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    fontSize: 18,
  }
});
