import React, {useState} from "react";
import Constants from 'expo-constants'
import {useNavigation} from '@react-navigation/native'
import {Alert, StyleSheet, View, Text, TextInput, Image, TouchableOpacity} from 'react-native'
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';

const Registre =() => {

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();


  const handleLogin = async () => {
    try {
      const data = {
        name: input1,
        username: input2,
        email: input3,
        password: input4,
      };
      const response = await axios.post('http://nattech.fib.upc.edu:40520/api/register', data);
      if (response.status === 201) {
        navigation.navigate('Home');
      } else {
        Alert.alert('El email introduit ja esta en ús');
      }
    } catch (error) {
      console.error('Error en la llamada POST:', error);
      console.log('Detalles del error:', error.response?.data);
      if (error.response) {
        const errorData = error.response.data;
        console.log(errorData.message);

        // Manejo de casos específicos según el mensaje
        if (errorData.message.includes('at least 6 characters')) {
          Alert.alert('Error', t('shortpassword'));
        } else if (errorData.message.includes('email has already been taken')) {
          Alert.alert('Error', t('emailregistered'));
        } else if (errorData.message.includes('The email field must be a valid email address')) {
          Alert.alert('Error', t('invalidemail'));
        } else {
          Alert.alert('Error: '+ error);
        }
      } else {
        // Caso general sin respuesta del servidor
        Alert.alert('Error', error);
      }
    }
  };


    return (
        <View style={styles.container}>
            <Text style={styles.titol}>ENERQUIZ</Text>
            <View style={styles.container2}>
                <Text style={styles.titol2}>{t('registerTitle')}</Text>
                <TextInput 
                    style={styles.input}
                    placeholder={t('namePlaceholder')}
                    onChangeText={setInput1}
                    value = {input1}
                    >
                </TextInput>
                <TextInput
                    style={styles.input}
                    placeholder={t('usernamePlaceholder')}
                    onChangeText={setInput2}
                    value = {input2}
                    >
                </TextInput>
                <TextInput
                    style={styles.input}
                    placeholder={t('emailPlaceholder')}
                    onChangeText={setInput3}
                    value = {input3}
                    >
                </TextInput>
                <TextInput 
                    secureTextEntry={true}
                    style={styles.input}
                    placeholder={t('passwordPlaceholder')}
                    onChangeText={setInput4}
                    value = {input4}
                    >
                </TextInput>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleLogin}>
                    <Text style={styles.text}>{t('registerButton')}</Text>
                </TouchableOpacity>
                <Text>{t('alreadyHaveAccount')}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Text style={styles.link}>{t('loginLink')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2}>
                    <AntDesign name="googleplus" size={18} color="black"/>
                    <Text style={styles.text2}>{t('registerWithGoogleButton')}</Text>
                </TouchableOpacity>
                </View>
        </View>
      );
}


const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  container2: {
    alignItems: 'center',
    backgroundColor: '#90DF43',
    width: 300,
    height: 430,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 20
  },
  titol: {
    color: '#529D09',
    fontWeight: 'bold',
    fontSize: 50,
    padding: 5,
  },
  titol2: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 15,
    marginTop: 15
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 5,
    width: 250,
    height: 30,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5
  },
  button: {
    backgroundColor: '#529D09',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 20,
    width: 120
  },
  text: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  link: {
    color: 'blue',
    marginBottom: 20
  },
  button2: {
    backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    width: 200
  },
  text2: {
    color: 'black',
    textAlign: 'center',
    marginLeft: 5
  },
  image: {
    width: 15,
    height: 15,
    marginRight: 5
  }
});


export default Registre;