import React, {useState, useEffect} from 'react';
import { StyleSheet, FlatList, View, Alert, SafeAreaView, Keyboard } from 'react-native';
import { useAuth } from "../contexts/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInputMask } from 'react-native-masked-text'
import { Text, View as ViewThemed } from '../components/Themed';
import { Button } from 'react-native-paper';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns'
import Api from '../service/api';
import Payment from '../interfaces/Payment';
import Client from '../interfaces/Client';
import { formatDate, formatNumber, dayOfWeek } from '../helpers/utils';
import {Collapse,CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';

const dateFormat =  'dd/MM/yyyy';

export default function Payments({ route, navigation }: {route:any, navigation:any}) {
  const { user } = useAuth();
  const data = route.params?.data as Client;

  var moneyField = {} as TextInputMask|null;
 
  var initialForm = {
    date: formatDate(format(new Date(), 'yyyy-MM-dd')),
    amount: '',
    clientId: data._id
  } as Payment;

  const [formData, setFormData] = useState<Payment>(initialForm);
  const [paymentList, setPaymentList] = React.useState([]);
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const getPayments = () => {
    Api.post('payments', {clientId: data?._id}).then(response => {
        setPaymentList(response.data);
        if (response.data && response.data.length == 0 ) setCollapsed(true);
    });
  };

  useEffect(() => {
      getPayments();
      // eslint-disable-next-line
  }, []) 

  const validationSchema = Yup.object().shape({
    date: Yup.string().required('Data é obrigatória').min(9, 'Data inválida'),
    amount: Yup.string().required('Valor é obrigatório')
  });
  
  function handleSubmit(form: any, {setSubmitting, resetForm}:{setSubmitting: any, resetForm: any}) {    
    const dados = { ...form };
    dados.date = formatDate(form.date);
    dados.amount = moneyField?.getRawValue();
   
    Api.post('/addPayment', dados)
        .then(res => {
            setSubmitting(false);  
            if (!res.data.errors) {         
              getPayments();
              Keyboard.dismiss();    
              resetForm();  
            } else {
              alert('Aconteceu um erro ao salvar. Tente novamente.');                
              console.log(res.data.errors); 
            }
    });
  }

  function openDeleteConfirmation(item:Payment) {
    Alert.alert(
      "Excluir",
      "Deseja realmente excluir?",
      [
        { text: "Não", onPress:  ()=>{}, style: "cancel"
        },
        { text: "Sim", onPress: ()=>deletePayment(item) }
      ],
      { cancelable: false }
    );
  }

  function deletePayment(item:Payment) {   
    console.log(item) 
    if (!!item) {
      Api.delete(`/deletePayment/${item._id}`)
          .then(res => {
            console.log(res)
              if (!res.data?.errors) {   
                getPayments();
              } else {
                alert('Aconteceu um erro ao excluir. Tente novamente.');                
                console.log(res.data.errors); 
              }
      });
    }
  }

  return (
    <View style={styles.container}>     

      <View style={styles.header}>
        <Text style={styles.title}>{'Pagamentos de '+data?.name}</Text>  
      </View>

      <ViewThemed style={styles.separator} lightColor="rgba(0,0,0,0.2)" />
           
      <View style={styles.form}>
        <Collapse onToggle={(isCollapsed:boolean)=>setCollapsed(isCollapsed)} isCollapsed={collapsed}>
          <CollapseHeader>
            <View style={styles.collapse}>
              <FontAwesome5 size={22} name="plus" style={{color: 'green'}}/>
              <Text style={{fontSize: 16,marginHorizontal: 20}}>novo pagamento</Text>
              { collapsed ? 
                <Ionicons name="ios-arrow-up" size={24} color="black" /> :
                <Ionicons name="ios-arrow-down" size={24} color="black" /> 
              }
            </View>
          </CollapseHeader>
          <CollapseBody style={{marginTop: 16}}>
            <Formik
              enableReinitialize
              initialValues={formData}
              validationSchema={validationSchema}
              onSubmit={(formData, {setSubmitting, resetForm}) => handleSubmit(formData, {setSubmitting, resetForm})}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, setSubmitting, resetForm, values, errors, touched, isValid, isSubmitting }) => (
                <View>
                            
                  <TextInputMask
                    type={'datetime'}
                    options={{ format: dateFormat}}
                    placeholder={'Data de início'}
                    value={values.date}
                    onChangeText={handleChange('date')}
                    onBlur={handleBlur('date')}
                    style={styles.input}
                  />    

                  <TextInputMask
                    ref={ref => moneyField = ref}
                    type={'money'}
                    placeholder={'Valor'}
                    value={values.amount}
                    onChangeText={handleChange('amount')}
                    onBlur={handleBlur('amount')}
                    style={styles.input}
                    options={{unit: 'R$ '}}
                  />
                  { (errors.amount && touched.amount) && 
                    <Text style={styles.helperText}>{errors.amount}</Text>
                  }

                  <View style={styles.actions}>
                    <Button mode="outlined"
                      onPress={resetForm} 
                      contentStyle={styles.button}
                    >
                      LIMPAR
                    </Button>
                    <Button mode="contained"
                      onPress={handleSubmit} 
                      disabled={!isValid || isSubmitting} 
                      contentStyle={styles.button}
                    >
                      SALVAR
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
          </CollapseBody>
        </Collapse>
      </View>
      
      <View style={styles.details}>
        <Text style={{fontSize: 16}}>{paymentList.length+" pagamentos"}  -  R$ {formatNumber(data?.totalPayments)}</Text>        
      </View>
     
      <SafeAreaView style={styles.list}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={paymentList}
          keyExtractor={(item, index) => item._id}
          renderItem={({item, index}: {item: Payment, index: number}) => 
            (
              <ViewThemed style={styles.item}>      
                <View style={styles.row}>
                  <View style={[styles.column, {width:'10%'}]}>
                    <Text>#{paymentList.length - index}</Text>
                  </View>
                  <View style={[styles.column, {width:'40%'}]}>
                    <Text>R$ {formatNumber(item.amount)}</Text>
                  </View>
                  <View style={[styles.column, {width:'40%'}]}>
                    <Text>{ dayOfWeek(new Date(item.date).getDay())}, {formatDate(item.date)}</Text>
                  </View>
                  <View style={[styles.column, {alignItems: 'flex-end'}]}>
                    <FontAwesome onPress={()=>openDeleteConfirmation(item)} size={25} name="remove" style={{color: 'red'}}/>
                  </View>
                </View>
              </ViewThemed>
            )
          }
        /> 
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center'
  },
  separator: {
    marginTop: 10,
    height: 1,
    width: '80%',
  },
  form: {
    width: '100%',
    marginTop: 16,
    
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 18,
  },
  helperText: {
    marginLeft: 25,
    color: 'red'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  button: {
    height: 50,
    width: 150,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  item: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 10,
  },
  list: {
    width: '100%',
    marginTop: 20,
    marginBottom: -16,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  details: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  collapse: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50
  }
});