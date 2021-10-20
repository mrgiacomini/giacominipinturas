import * as React from 'react';
import { StyleSheet, FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';

import { Text, View as ViewThemed, SafeAreaView } from '../components/Themed';
import { useFetchPost } from '../hooks/useFetch';
import { formatDate, formatNumber, formatCnpjCpf } from '../helpers/utils';
import { useAuth } from "../contexts/auth";
import { mutate as mutateGlobal } from 'swr';

function Item({data, navigation}: {data: any, navigation: any}) {
  return (
    <ViewThemed style={styles.item}>
      {/* <TouchableOpacity onPress={() => navigation.navigate('Pagamentos', {data: data})}> */}
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
    </ViewThemed>
  );
}

export default function TabThreeScreen() {
  const { user } = useAuth();

  const nfse = { user: user?.data?.user };

  const { data, error, isValidating } = useFetchPost('nfe/get', nfse);

  const onRefresh = React.useCallback(() => {
    mutateGlobal('nfe/get');
   }, []);
 
  return (
      <> 
        <SafeAreaView style={styles.container}>    
          <Text style={styles.title}>Nota Fiscal</Text>
          <ViewThemed style={styles.separator} lightColor="rgba(0,0,0,0.2)" />

          <FlatList
            showsVerticalScrollIndicator={false}
            data={data?.CompNfse}
            renderItem={({item}: {item: any}) => <Item data={item} navigation={{}}/>}
            keyExtractor={item => item.Nfse.InfNfse.Numero.toString()}
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
