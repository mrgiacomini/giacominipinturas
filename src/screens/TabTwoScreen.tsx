import React, {useState, useRef} from 'react';
import { StyleSheet, TextInput, View, Alert } from 'react-native';
import Colors from '../constants/Colors';
import { useAuth } from "../contexts/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextInputMask } from 'react-native-masked-text'
import { Text, View as ViewThemed } from '../components/Themed';
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { Button } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns'
import Api from '../service/api';

const dateFormat =  'dd/MM/yyyy';

export default function TabTwoScreen({navigation}) {
  const { user } = useAuth();
  var moneyField = {} as TextInputMask|null;
  console.log(navigation)
  const initialForm = {
    name: '',
    phone: '',
    email: '',
    date: '',
    location: '',
    totalAmount: '',
    description: '',
  };

  const [formData, setFormData] = useState<any>(initialForm);

  const regexPhone = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email não foi preenchido corretamente'),
    //phone: Yup.string().matches(regexPhone, 'Telefone não foi preenchido corretamente'),
    totalAmount: Yup.string().required('Valor total é obrigatório')
  });
  
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [datePicker, setDatePicker] = useState<Date>(new Date());

  const onChangeDate = (selectedDate, setFieldValue) => {
    setShowDatePicker(false);
    const formatted = format(new Date(selectedDate), dateFormat);
    setFieldValue('date', formatted, false);
  };

  function handleSubmit(form: any, {setSubmitting, resetForm}) {
    form.userId = user.data.user._id;
    form.totalAmount = moneyField.getRawValue();

    Api.post('/addClient', form)
        .then(res => {
            setSubmitting(false);  
            if (!res.data.errors) {               
              alert('sucesso');              
              resetForm();  
              navigation.navigate('Clientes');
            } else {
              alert('erro');                
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
      <Text style={styles.title}>Cadastro</Text>
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
            <TextInput
              placeholder={'Telefone'}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.phone}
              style={styles.input}
              autoCompleteType={"tel"}
              keyboardType={"phone-pad"}                      
            />
            { (errors.phone && touched.phone) && 
              <Text style={styles.helperText}>{errors.phone}</Text>
            }
            <View style={styles.input}>              
              <TextInputMask
                type={'datetime'}
                options={{ format: dateFormat}}
                placeholder={'Data de início'}
                value={values.date}
                onChangeText={handleChange('date')}
                onBlur={handleBlur('date')}
                style={{fontSize: 18}}
              />
              <FontAwesome5 onPress={()=>setShowDatePicker(true)} size={25} name="calendar-alt" />
            </View>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={datePicker}
                mode={'date'}
                display="default"
                onChange={(event, selectedDate) => onChangeDate(selectedDate, setFieldValue)}
              />
            )}

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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
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
});