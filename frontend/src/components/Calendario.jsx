import React, { useState, useEffect, useLayoutEffect  } from 'react';
import {useNavigation} from '@react-navigation/native'
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'
import { Alert, View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useBottomTab } from '@react-navigation/bottom-tabs';
import IconBar from './IconBar';
import moment from 'moment';
import axios from 'axios';
import {useAppContext} from './Appcontext'

import Ranking from './Ranking';




LocaleConfig.locales['custom'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
};
LocaleConfig.defaultLocale = 'custom';

const Calendario = () => {

const { mitoken} = useAppContext();
  const [dates, setDates] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const navigation = useNavigation();
  const [todayData, setTodayData] = useState(null);

  const handlePodiumPress = () => {
    navigation.navigate('Ranking');
  };

  const handleDayPress = (day) => {
      console.log('Día seleccionado:', day);

  const today = new Date().toISOString().split('T')[0];

      if (day.dateString === today && todayData === null) {
        navigation.navigate('QuizScreen');
        }
    };


   useLayoutEffect(() => {
    const obtenirDates = async () => {
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
            Alert.alert('Error', error);
          }
        };

    obtenirDates();
    const formattedDates = {};
    const totalDaysInMonth = moment().daysInMonth();
    const todayN = moment().format('YYYY-MM-DD');

    dates.forEach((date) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');

        if (formattedDate in formattedDates) {
          formattedDates[formattedDate] = {
            selected: true,
            selectedColor: formattedDates[formattedDate] ? '#529D09' : 'crimson'
          };
        }
      });

      // Iterar por las fechas calculadas
      for (let i = 1; i <= totalDaysInMonth; i++) {
        const date = moment(`${moment().year()}-${moment().month() + 1}-${i}`, 'YYYY-MM-DD').format('YYYY-MM-DD');

        if (formattedDates[date] === undefined) {
          formattedDates[date] = {
            selected: true,
            selectedColor: date === todayN ? 'lightgray' : 'gray',
          };
        }
      }

    setMarkedDates(formattedDates);
    const today = new Date().toISOString().split('T')[0];
    setTodayData(formattedDates.hasOwnProperty(today) ? today : null);
  }, [navigation]);

  return (
      <View style={styles.container}>
        <IconBar handlePodiumPress={handlePodiumPress}/>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Icon name="angle-left" size={30} color="black" />
                    </TouchableOpacity>
          <View style={styles.containerCalendar}>

              <Calendar
                style={styles.calendarstyle}
                markingType={'custom'}
                markedDates={markedDates}
                onDayPress={handleDayPress}
                />
                <View style={styles.quizBox}>


             {todayData !== null ? (

                <Text style={styles.quizText}>Ja has respost el daily Quiz avui!</Text>
                ) : (
              <Text style={styles.quizText}>Encara no has respost el daily Quiz, selecciona el dia d'avui per respondre'l!</Text>
                )}
             </View>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({

container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  separator: {
    height: 2,
    backgroundColor: '#A2A2A2',
  },

   backButton: {
       top: 20,
       left: 10,
    },

  containerCalendar: {
    flex: 1,
    position: 'absolute',
    top: '25%',
    left: '4%',
    width: '100%',
    height: '30%',
  },

  calendarstyle: {
      borderRadius: 15,
      backgroundColor: 'white',
      paddingBottom: 20,
  },

  quizBox: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginTop: 60,
      paddingVertical: 20,
      paddingHorizontal: 10,
      backgroundColor: '#82e27a',
      width: '100%',
    },
    quizText: {
      color: 'black',
      marginBottom: 5,
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
    },

});

export default Calendario;