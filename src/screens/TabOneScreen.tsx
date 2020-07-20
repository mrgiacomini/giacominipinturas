import React, {useEffect} from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, Text, View as ViewThemed } from '../components/Themed';
import { Button } from 'react-native-paper';
import Api from '../service/api';
import Client from '../interfaces/Client';
import { formatNumber } from '../helpers/utils';

function Item({data, navigation}: {data: Client, navigation: any}) {
  return (
    <ViewThemed style={styles.item}>
      <TouchableOpacity onPress={() => navigation.navigate('Pagamentos', {data: data})}>
      <View style={styles.row}>
        <Text style={styles.itemTitle}>{data.name}</Text>
        <Button icon='pencil' style={styles.buttonEdit}
          onPress={() => navigation.navigate('EditaCliente', {action: 'edit', data: data})}   
        >editar
        </Button>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.itemTotalAmount}>R$ {formatNumber(data.totalAmount)}</Text>
          <Text style={styles.itemAmountReceived}>R$ {formatNumber(data.totalPayments)}</Text>
        </View>
        <View style={[styles.column, {alignItems: 'flex-end'}]}>
          <Text style={{color: '#999966'}}>a receber</Text>
          <Text style={styles.itemAmountToReceive}>R$ {formatNumber(+data.totalAmount - +data.totalPayments)}</Text>
        </View>
      </View>
      </TouchableOpacity>
    </ViewThemed>
  );
}

export default function TabOneScreen({route, navigation}: {route:any, navigation:any}) {
  const [clientList, setClientList ] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getClients();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    getClients();
  }, []);

  function getClients() {  
    setClientList([]);
    setRefreshing(true);
    Api.get('clients').then(response => {
      setClientList(response.data);
      setRefreshing(false);
    }).catch(e => console.log(e));
  }

  return (
    <SafeAreaView style={styles.container}>      
      <FlatList
        showsVerticalScrollIndicator={false}
        data={clientList}
        renderItem={({item}: {item: Client}) => <Item data={item} navigation={navigation}/>}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      /> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50
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
    marginRight:'-5%'
  }
});
