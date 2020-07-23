import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, RefreshControl, ImageBackground } from 'react-native';
import { SafeAreaView, Text, View as ViewThemed } from '../components/Themed';
import { Button } from 'react-native-paper';
import Client from '../interfaces/Client';
import { formatNumber } from '../helpers/utils';
import { useFetch } from '../hooks/useFetch';
import { mutate as mutateGlobal } from 'swr';
import carimbo from '../../assets/images/carimbo-entregue.png';

function Item({data, navigation}: {data: Client, navigation: any}) {
  return (
    <ViewThemed style={styles.item}>
      <ImageBackground source={data.completed ? carimbo : null} imageStyle={styles.imageBackground} style={styles.background}>
      <TouchableOpacity onPress={() => navigation.navigate('Pagamentos', {data: data})}>
      <View style={styles.row}>
        <View style={[styles.column, {width: '70%'}]}>
          <Text style={styles.itemTitle}>{data.name}</Text>
        </View>
        <View style={styles.column}>
          <Button icon='pencil' style={styles.buttonEdit} 
              onPress={() => navigation.navigate('EditaCliente', {action: 'edit', data: data})}   
              hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
            >editar
          </Button>
        </View>
      </View>
    
      <View style={[styles.row, {marginTop: 10}]}>
        <View style={styles.column}>
          <Text style={styles.itemTotalAmount}>TOTAL</Text>
          <Text style={styles.itemAmountReceived}>{data.quantityPayments} {data.quantityPayments === 1 ? "pagamento" :  "pagamentos"}</Text>          
          <Text style={[styles.itemTotalAmount, {color: '#999966'}]}>a receber</Text>
        </View>
        <View style={[styles.column, {alignItems: 'flex-start'}]}>
          <Text style={styles.itemTotalAmount}>R$ {formatNumber(data.totalAmount)}</Text>
          <Text style={styles.itemAmountReceived}>R$ {formatNumber(data.totalPayments)}</Text>
          <Text style={styles.itemAmountToReceive}>R$ {formatNumber(+data.totalAmount - +data.totalPayments)}</Text>
        </View>
      </View>
      </TouchableOpacity>
      </ImageBackground>
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
    minHeight: 50
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
    minHeight: 180,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    marginVertical: 4,
    flexDirection: 'column',
    justifyContent: 'space-between'
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
  },
  imageBackground: {
    margin: '5%',
    width: '90%',
    resizeMode: "contain",
    opacity:0.5
  },
  background: {
    flex: 1,
  }
});
