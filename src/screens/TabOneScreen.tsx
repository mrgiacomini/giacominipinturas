import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView, Text, View as ViewThemed } from '../components/Themed';
import { Button } from 'react-native-paper';
import Client from '../interfaces/Client';
import { formatNumber } from '../helpers/utils';
import { useFetch } from '../hooks/useFetch';
import { mutate as mutateGlobal } from 'swr';

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
  const { data, error, isValidating } = useFetch('clients');
  
  const onRefresh = React.useCallback(() => {
    mutateGlobal('clients');
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>      
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({item}: {item: Client}) => <Item data={item} navigation={navigation}/>}
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl refreshing={isValidating} onRefresh={onRefresh} />
        }
      /> 
    </SafeAreaView>
  );
};

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
