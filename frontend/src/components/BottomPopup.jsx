import React from 'react';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome'
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import {useNavigation} from '@react-navigation/native'
import {View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';



   const BottomPopup = ({ isVisible, onClose }) => {
    const { t } = useTranslation();
     const navigation = useNavigation();
     return (
       <Modal
         animationType="slide"
         transparent={true}
         isVisible={isVisible}
         onBackdropPress={onClose} // Cierra el modal al hacer clic fuera de él
         style={styles.container}
       >

         <View style={styles.popup}>
           <View style={styles.iconContainer}>
               <Icon name="image" size={30} color="black" />
             </View>
            <TouchableOpacity onPress={() => navigation.navigate("VistaAddFoto")}>
             <View >
               <Text>{t('insertImageFromGallery')}</Text>
             </View>
            </TouchableOpacity>
         </View>
       </Modal>
     );
   }





const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  popup: {
    backgroundColor: 'white',
    width: '100%',
    height: 80,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

    iconContainer: {
      marginRight: 20, // Espacio entre el icono y el texto
    },

});

export default BottomPopup;