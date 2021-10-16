import * as React from 'react';
import { StyleSheet, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';

import { Text, View as ViewThemed, SafeAreaView } from '../components/Themed';
import Api from '../service/api';
import { useFetchPost } from '../hooks/useFetch';
import { mutate as mutateGlobal } from 'swr';
import { formatDate, formatNumber, formatCnpjCpf } from '../helpers/utils';

function Item({data, navigation}: {data: any, navigation: any}) {
  function getNfse(number: any) {

    var nfseByNumber = { numeroNfse: number.toString(), username: '14775228000168', password: '14775228'};

    Api.post('/nfe/getByNumber', nfseByNumber)
          .then(res => {
              console.log(res.data);
              if (!res.data.errors) { 
                alert('sucesso');
              } else
                alert('erro' + JSON.stringify(res.data.errors));
      });
  }

  return (
    <ViewThemed style={styles.item}>
      <TouchableOpacity onPress={() => getNfse(data.Nfse.InfNfse.Numero)}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.itemTitle}>NFS-e: {data.Nfse.InfNfse.Numero}</Text>       
          <Text style={[styles.itemDesc, {marginTop: 10}]}>EMISSÃO: {formatDate(data.Nfse.InfNfse.DataEmissao)}</Text>   
        </View>
        <View style={styles.column}>
        <Text style={styles.itemTitle}>R$ {formatNumber(data.Nfse.InfNfse.ValoresNfse.ValorLiquidoNfse)}</Text>
        </View>
      </View>
      <View style={[styles.row, {marginTop: 10}]}>
        <View style={styles.column}>
          <Text style={styles.itemDesc}>{data.Nfse.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.RazaoSocial}</Text>
          <Text style={[styles.itemDesc, {marginTop: 10}]}>
            {
              !!data.Nfse.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cnpj ?
              'CNPJ: ' + formatCnpjCpf(data.Nfse.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cnpj) :
              'CPF: ' + formatCnpjCpf(data.Nfse.InfNfse.DeclaracaoPrestacaoServico.InfDeclaracaoPrestacaoServico.Tomador.IdentificacaoTomador.CpfCnpj.Cpf)
            }
          </Text>
        </View>
        <View style={styles.column}>

        </View>
      </View>
    
      {/* <View style={[styles.row, {marginTop: 10}]}>
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
      </View> */}
      </TouchableOpacity>
     
    </ViewThemed>
  );
}

export default function TabThreeScreen() {
  const nfseFaixa = { numeroNfse: '1', username: '14775228000168', password: '14775228'};

  const { data, error, isValidating } = useFetchPost('/nfe/get', nfseFaixa);

  const onRefresh = React.useCallback(() => {
    mutateGlobal('/nfe/get');
  }, []);
 
return (
    <> 
      <SafeAreaView style={styles.container}>    
        <Text style={styles.title}>Acessar Nota Fiscal</Text>
        <ViewThemed style={styles.separator} lightColor="rgba(0,0,0,0.2)" />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={data?.CompNfse}
          renderItem={({item}: {item: any}) => <Item data={item} navigation={{}}/>}
          keyExtractor={(item, index) => item.Nfse.InfNfse.Numero.toString()}
          refreshControl={
            <RefreshControl refreshing={isValidating} onRefresh={onRefresh} />
          }
          style={{marginTop: 10}}
        /> 
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: '80%'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  itemTitle: {
    fontSize: 24,
  },
  itemDesc: {
    fontSize: 16,
  },
  item: {
    minHeight: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    marginVertical: 4,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
});
