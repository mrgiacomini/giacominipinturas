import React, {useState} from 'react';
import { StyleSheet, TextInput, View, Alert, Linking } from 'react-native';
import { useAuth } from "../contexts/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInputMask } from 'react-native-masked-text'
import { Text, View as ViewThemed } from '../components/Themed';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Button } from 'react-native-paper';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Api from '../service/api';
import Client from '../interfaces/Client';
import { formatDate } from '../helpers/utils';
import Colors from '../constants/Colors';
import { mutate as mutateGlobal } from 'swr';

const dateFormat =  'dd/MM/yyyy';

export default function TabTwoScreen({route, navigation}: {route:any, navigation:any}) {
  const { user } = useAuth();
  const isEdit = route.params?.action == 'edit';
  const data = route.params?.data;

  var moneyField = {} as TextInputMask|null;
 
  var initialForm = {
    name: '',
    phone: '',
    email: '',
    date: '',
    location: '',
    totalAmount: '',
    description: '',
  } as Client;

  if (isEdit && !!data) {
    data.date = formatDate(data.date);
    initialForm = data;
  }

  const [formData, setFormData] = useState<Client>(initialForm);
  
  const regexPhone = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email não foi preenchido corretamente'),
    date: Yup.string().min(9, 'Data inválida'),
    phone: Yup.string().matches(regexPhone, 'Telefone não foi preenchido corretamente'),
    totalAmount: Yup.string().required('Valor total é obrigatório')
  });
  
  function handleSubmit(form: any, {setSubmitting, resetForm}:{setSubmitting: any, resetForm: any}) {
    const dados = { ...form };
    dados.userId = user.data.user._id;
    dados.date = formatDate(form.date);
    dados.totalAmount = moneyField?.getRawValue();
   
    if (isEdit) 
      Api.put(`/updateClient/${form._id}`, dados)
        .then(res => {
            setSubmitting(false);  
            if (!res.data.errors) {                     
              resetForm();  
              mutateGlobal('clients');
              navigation.navigate('ListaClientes');
            } else {
              alert('Aconteceu um erro ao salvar. Tente novamente.');                 
              console.log(res.data.errors); 
            }
      });
    else
      Api.post('/addClient', dados)
        .then(res => {
            setSubmitting(false);  
            if (!res.data.errors) {          
              resetForm();  
              navigation.navigate('Clientes');
              mutateGlobal('clients');
            } else {
              alert('Aconteceu um erro ao salvar. Tente novamente.');                
              console.log(res.data.errors); 
            }
      });
  }

  function openDeleteConfirmation() {
    Alert.alert(
      "Excluir",
      "Deseja realmente excluir?",
      [
        {
          text: "Não",
          onPress: () => {},
          style: "cancel"
        },
        { text: "Sim", onPress: deleteClient }
      ],
      { cancelable: false }
    );
  }

  function deleteClient() {    
    Api.delete(`/deleteClient/${data._id}`)
        .then(res => {
            if (!res.data.errors) {   
              navigation.navigate('ListaClientes');
            } else {
              alert('Aconteceu um erro ao excluir.');                
              console.log(res.data.errors); 
            }
    });
  }
 
  function countLines(value:string) {
    var count = 1;
    if (!!value)
        count = value.split("\n").length;
    return count > 1 ? count : 2;
  };  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{ isEdit ? 'Editar' : 'Cadastro'}</Text>
        { isEdit && <FontAwesome5 onPress={openDeleteConfirmation} size={25} name="trash-alt" style={{color: 'red'}}/> }
      </View>
      
      <ViewThemed style={styles.separator} lightColor="rgba(0,0,0,0.2)" />
      
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={styles.form} showsVerticalScrollIndicator={false}>
        <Formik
          enableReinitialize
          initialValues={formData}
          validationSchema={validationSchema}
          onSubmit={(formData, {setSubmitting, resetForm}) => handleSubmit(formData, {setSubmitting, resetForm})}
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, setSubmitting, resetForm, values, errors, touched, isValid, isSubmitting }) => (
            <View>
              <TextInput
                placeholder={'Nome'}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                style={styles.input}
                autoCompleteType={"name"}
              />
              { (errors.name && touched.name) && 
                <Text style={styles.helperText}>{errors.name}</Text>
              }
              <TextInput
                placeholder={'Email'}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
                autoCompleteType={"email"}
                keyboardType={"email-address"}
              />
              { (errors.email && touched.email) && 
                <Text style={styles.helperText}>{errors.email}</Text>
              }
              <View style={styles.input}>
                <TextInput
                  placeholder={'Telefone'}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                  style={{width: '80%', fontSize: 18}}
                  autoCompleteType={"tel"}
                  keyboardType={"phone-pad"}                      
                />
                { !!values.phone &&
                  <View style={styles.inputIcons}>
                    <TouchableOpacity onPress={()=>Linking.openURL(`tel://${values.phone}`)}>
                      <MaterialIcons  name="phone-forwarded" size={20} color={Colors['light'].tint}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>Linking.openURL(`whatsapp://send?phone=+55${values.phone}`)} >
                      <FontAwesome5 name="whatsapp-square" size={25} color='rgb(7,188,76)'/>
                    </TouchableOpacity>
                  </View>
                }
              </View>
              
              { (errors.phone && touched.phone) && 
                <Text style={styles.helperText}>{errors.phone}</Text>
              }
              <TextInputMask
                type={'datetime'}
                options={{ format: dateFormat}}
                placeholder={'Data de início'}
                value={values.date}
                onChangeText={handleChange('date')}
                onBlur={handleBlur('date')}
                style={styles.input}
              />                
              { (errors.date && touched.date) && 
                <Text style={styles.helperText}>{errors.date}</Text>
              }              
              <TextInput 
                placeholder={'Localização'}
                value={values.location}
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
                style={styles.input}
              />   
              { (errors.location && touched.location) && 
                <Text style={styles.helperText}>{errors.location}</Text>
              }
              <TextInput 
                placeholder={'Descrição'}
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                style={styles.input}
                multiline={true}
                numberOfLines={countLines(values.description)}
              />
              <TextInputMask
                ref={ref => moneyField = ref}
                type={'money'}
                placeholder={'Valor Total'}
                value={values.totalAmount}
                onChangeText={handleChange('totalAmount')}
                onBlur={handleBlur('totalAmount')}
                style={styles.input}
                options={{unit: 'R$ '}}
              />
              { (errors.totalAmount && touched.totalAmount) && 
                <Text style={styles.helperText}>{errors.totalAmount}</Text>
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
      </ScrollView>
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
    width: '70%',
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
  inputIcons: {
    width: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});