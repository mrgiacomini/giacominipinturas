import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { Button } from 'react-native-paper';
import Api from '../service/api';

export default function TabThreeScreen() {

  function getNota() {
    Api.get('/nfe/nfe')
          .then(res => {
              console.log(res.data); 
      });
  }
 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acessar Nota Fiscal</Text>
      <View style={styles.separator} lightColor="rgba(0,0,0,0.2)" />
      <Text>Em desenvolvimento</Text>

      <Button mode="contained" onPress={()=>getNota()}>Get Nota</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: '80%',
  },
});
