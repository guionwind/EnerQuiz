import React, {useState, useCallback} from "react";
import Constants from 'expo-constants'
import { NavigationContainer } from '@react-navigation/native';
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import Registre from "./Registre";
import PantallaMapa from "./PantallaMapa";
import ShowProfile from "./ShowProfile";
import Profile from "./Profile";
import {Alert, StyleSheet, View, Text, TextInput, Image, TouchableOpacity} from 'react-native'
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import { useAppContext } from "./Appcontext";


function Main() {
  const { t } = useTranslation();

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const navigation = useNavigation();

  const { guardarToken } = useAppContext();


  const handleLogin = async () => {
    try {
      const data = {
        email: input1,
        password: input2,
      };
      const response = await axios.post('http://nattech.fib.upc.edu:40520/api/login', data);
      if (response.status === 200) {
        //guardem el token del login
        const jsonString = response.data;
        const tokenValue = jsonString.token;
        guardarToken(tokenValue);
        console.log(tokenValue);
        navigation.navigate('MapaIni');
      } else {
        Alert.alert(t('Dades incorrectes'));
        console.log(response.status);
      }
    } catch (error) {
      console.error('Error en la llamada POST:', error);
      console.log('Detalles del error:', error.response?.data);
      if (error.response && error.response.status === 401) Alert.alert(t('Dades incorrectes'));
      else Alert.alert('Error: '+ error);

      //Alert.alert(t('Dades incorrectes'));
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Restablecer los valores de los TextInput cuando la pantalla se enfoca
      setInput1("");
      setInput2("");
    }, [])
  );

  return (
    <View style={styles.container}>
        <Text style={styles.titol}>ENERQUIZ</Text>
        <View style={styles.container2}>
            <Text style={styles.titol2}>{t('LOGIN')}</Text>
            <TextInput 
                style={styles.input}
                placeholder={t('Correu electronic')}
                onChangeText={setInput1}
                value = {input1}>
            </TextInput>
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder={t('Contrasenya')}
                onChangeText={setInput2}
                value = {input2}>
            </TextInput>
            <TouchableOpacity style={styles.button}
              onPress={handleLogin}>
                <Text style={styles.text}>{t('LOGIN')}</Text>
            </TouchableOpacity>
            <Text>{t('No tens compte?')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registre')}>
                <Text style={styles.link}>{t('Registra\'t')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2}>
                <AntDesign name="googleplus" size={18} color="black"/>
                <Text style={styles.text2}>{t('Inicia sessió amb Google')}</Text>
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
        height: 400,
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
        width: 100
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
        width: 215
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


export default Main;