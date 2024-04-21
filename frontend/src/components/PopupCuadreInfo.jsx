import React, { useState , useEffect } from 'react';
import { View, Text, Modal, ScrollView, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import { PieChart } from 'react-native-chart-kit';
import { Svg, Circle } from 'react-native-svg';
import axios from 'axios';
import {useAppContext} from './Appcontext'




const PopupCuadreInfo = ({ visible, onClose, titulo, primari, industrial, construccio, terciari, domestic}) => {
  const [slideAnimation, setSlideAnimation] = useState(new Animated.Value(100));
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { mitoken} = useAppContext();
  const energiatotal = primari + industrial + construccio + terciari + domestic;



  const data = [
    {
      name: "Primari",
      population: primari,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Industrial",
      population: industrial,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Construcció",
      population: construccio,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Terciari",
      population: terciari,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
    {
      name: "Us Domestic",
      population: domestic,
      color: "rgb(0, 0, 0.51)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    },
  ];

  const closePopup = () => {
    Animated.timing(slideAnimation, {
      toValue: 100,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  const contentStyle = {
    ...styles.modalContent,
    transform: [
      {
        translateY: slideAnimation.interpolate({ inputRange: [0, 100], outputRange: [0, 100] }),
      },
    ],
  };


  return (
      <Modal transparent={true} visible={visible} animationType="slide" >
        <TouchableWithoutFeedback onPress={closePopup}>
         <View style = {styles.containerTransp}>
          <TouchableWithoutFeedback>
              <View style={styles.modalOverlay}>
                <Animated.View style={styles.modalContent}>
                  <Text style={styles.titulo}>{titulo}</Text>
                  <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                  
                    <Text style={styles.scrollText}>{t('energiatotal')}{energiatotal} KWh</Text>

                    <Text style={{ ...styles.scrollText, marginLeft: 30, marginTop: 10 }}>{t('primari')}{Number(primari)}KWh</Text>
                    <Text style={{ ...styles.scrollText, marginLeft: 30 }}>{t('industrial')}{Number(industrial)}KWh</Text>
                    <Text style={{ ...styles.scrollText, marginLeft: 30 }}>{t('construccio')}{Number(construccio)}KWh</Text>
                    <Text style={{ ...styles.scrollText, marginLeft: 30 }}>{t('terciari')}{Number(terciari)}KWh</Text>
                    <Text style={{ ...styles.scrollText, marginLeft: 30 }}>{t('domestic')}{Number(domestic)}KWh</Text>

                    
                    

                      
                  </ScrollView>
                </Animated.View>
                </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
      </Modal>
    );
  };

const styles = StyleSheet.create({
containerTransp:{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    height: '35%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    shadowOffset: { width: 0, height: -5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1,
    width: '95%',
    height: '100%',
    position: 'relative', // Cambia la posición a 'relative'
    marginTop: 'auto',    // Ajusta el margen superior (desplazamiento desde arriba)
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
   titulo: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
  },
  scrollText: {
    textAlign: 'left', // Alinea el texto a la izquierda
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
});

export default PopupCuadreInfo;
