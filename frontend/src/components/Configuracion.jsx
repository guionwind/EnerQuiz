import React, { useState, useEffect, useLayoutEffect  } from 'react';
import {useNavigation} from '@react-navigation/native'
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch } from 'react-native';
import { useBottomTab } from '@react-navigation/bottom-tabs';
import IconBar from './IconBar';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker'
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import {useAppContext} from './Appcontext';

const Configuracion = () => {
    const navigation = useNavigation();
    const { mitoken} = useAppContext();
    const [perfil, setPerfil] = useState('');
    const { t, i18n } = useTranslation();
    const [notifications, setNotifications] = useState(false);
    const [location, setLocation] = useState(false);
    const [dailydone, setDailydone] = useState(false);
    const [dates, setDates] = useState([]);


useEffect(() => {
        const obtenirDadesPerfil = async () => {
          try {
            const response = await axios.get('http://nattech.fib.upc.edu:40520/api/myProfile', {
                 headers: {
                   'Authorization': `Bearer ${mitoken}`,
                 }
               });
            if (response.status === 200) {
                setPerfil(response.data.language);
            } else {
              Alert.alert('Error al carregar el perfil');
              //console.log(response.status);
            }
          } catch (error) {
            console.error('Error en la llamada GET:', error);
            //console.log('Detalles del error:', error.response?.data);
          }
        };
    checkdaily();
    const today = new Date().toISOString().split('T')[0];
    if(dates.hasOwnProperty(today) === null) scheduleNotification();
    obtenirDadesPerfil();
  },[]);

  const checkdaily = async () =>{
      try {
                  const response = await axios.get('http://nattech.fib.upc.edu:40520/api/dailyquiz/history', {
                            headers: {
                              'Authorization': `Bearer ${mitoken}`,
                            }
                          });
                  if (response.status === 200) {
                    setDates(response.data);
                  } else {
                    Alert.alert('Error al carregar les Dates');
                    //console.log(response.status);
                  }
                } catch (error) {
                  console.error('Error en la llamada GET daily:', error);
                  //console.log('Detalles del error:', error.response?.data);
                }
  };

  const handleLanguageChange = (value) => {
        i18n.changeLanguage(value);
      };


  const handleNotificationsToggle = () => {
    setNotifications(!notifications);
  };

  const handleLocationToggle = () => {
    setLocation(!location);
    putlocation(!location);
    // Aquí puedes realizar otras acciones relacionadas con la ubicación
  };

  const putlocation = async (loca) => {
    try {
      const data = {
        toggle_localization: loca
      };
      const response = await axios.put('http://nattech.fib.upc.edu:40520/api/myProfile/update', data , {
        headers: {
          'Authorization': `Bearer ${mitoken}`,
        }
      });
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado diferente de 2xx
        console.error('Respuesta del servidor con error:', error.response.data);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
      } else {
        // Algo sucedió en la configuración de la solicitud que causó el error
        console.error('Error de configuración de la solicitud:', error.message);
      }
    }
};



    const scheduleNotification = () => {
      const startHour = 9;
      const endHour = 22;

      // Calcula un momento aleatorio dentro del rango especificado
      const randomHour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;

      // Programa la notificación para el momento aleatorio del día
      PushNotification.localNotificationSchedule({
        title: 'Recordatorio',
        message: 'Hoy aún no has hecho el daily quiz. ¡No te olvides!',
        date: new Date().setHours(randomHour, 0, 0),
      });
      console.log("Noti creada");
    };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                          <Icon name="angle-left" size={30} color="black" />
                        </TouchableOpacity>
        <Text style = {styles.title}>{t('configtitle')}</Text>
    </View>
      <View style={styles.toggleContainer}>
        <Text>{t('notificaciones')}</Text>
        <Switch
          value={notifications}
          onValueChange={handleNotificationsToggle}
        />
      </View>
      <View style={styles.toggleContainer}>
        <Text>{t('localizacion')}</Text>
        <Switch value={location} onValueChange={handleLocationToggle} />
      </View>
      <Text style={styles.label}>{t('idioma')}</Text>
                    <Picker
                        selectedValue={perfil}
                        onValueChange={(value) => handleLanguageChange(value)}
                        style={styles.picker}
                      >
                        <Picker.Item label={t('catalan')} value="cat" />
                        <Picker.Item label={t('castellano')} value="es" />
                        <Picker.Item label={t('ingles')} value="en" />
                      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white',
        padding: 20,
  },
   header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
          },
  toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginLeft: 5,
  },
  label: {
          color: 'grey',
          textAlign: 'center',
          marginTop: 10,
          marginLeft: 5

        },
    picker: {
        width: 300,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: 'center',
        marginTop: 15,
        marginLeft: '21%'
    },
    backButton: {
                position: 'absolute',
                left: 10,
                marginTop: 15,
          },
});

export default Configuracion;
