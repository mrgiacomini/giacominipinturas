import React, {useEffect} from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, Text, View as ViewThemed } from '../components/Themed';
import { Button } from 'react-native-paper';
import Api from '../service/api';

interface Client {
  _id: string,
  name: string,
  phone: string,
  email: string,
  date: string,
  location: string,
  totalAmount: string,
  description: string,
  totalPayments: number
}

const data = {
  _id: "5eee6dae8f766700179b656f",
  date: "2020-06-20T20:10:01.927Z",
  description: "Pintura completa portas verniz PU e textura e crepe na parte externa.",
  email: "",
  location: "Perto do equilíbrio",
  name: "Airton e Célia",
  phone: "+55 14 99648-4676",
  quantityPayments: 2,
  totalAmount: "20000.00",
  totalPayments: 21500
}

function Item({data, navigation}) {
  return (
    <ViewThemed style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.itemTitle}>{data.name}</Text>
        <Button onPress={navigation.navigate('EditaCliente', {action: 'edit'})} icon='pencil' style={styles.buttonEdit}>editar</Button>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.itemTotalAmount}>R$ {data.totalAmount}</Text>
          <Text style={styles.itemAmountReceived}>R$ {data.totalPayments}</Text>
        </View>
        <View style={styles.column}>
          <Text style={{color: '#999966'}}>a receber</Text>
          <Text style={styles.itemAmountToReceive}>R$ {+data.totalAmount - +data.totalPayments}</Text>
        </View>
      </View>
    </ViewThemed>
  );
}

export default function TabOneScreen({navigation}: {navigation:any}) {
  const [state, setState ] = React.useState({
    clientList: [],
    didGetClients: false
  });

  // useEffect(() => {
  //   Api.get('clients').then(response => {
  //     setState({clientList: response.data, didGetClients: true });
  //   });
  // },[]);

  useFocusEffect(
    React.useCallback(() => {
      Api.get('clients').then(response => {
        setState({clientList: response.data, didGetClients: true });
      });
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      { !!data ?
        <FlatList
          showsVerticalScrollIndicator={false}
          data={state.clientList}
          renderItem={({item}) => <Item data={item} navigation={navigation}/>}
          keyExtractor={item => item._id}
        /> : null
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 28,
  },
  item: {
    height: 150,
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 4,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  itemTotalAmount: {
    fontSize: 18
  },
  itemAmountReceived: {
    fontSize: 18,
    color: '#009900'
  },
  itemAmountToReceive: {
    fontSize: 18,
    color: '#999966'
  },
  buttonEdit: {
    paddingRight: 0
  }
});
