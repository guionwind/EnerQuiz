import React from 'react';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native'
import {View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';


const UnfriendPopup = ({ isVisible, onClose, idPerfil }) => {
     const navigation = useNavigation();


     const handleUnfriend = async () => {
            const response = await axios.get('http://nattech.fib.upc.edu:40520/api/unfriend/' + idPerfil);
                       if (response.status === 200) {

                       } else {
                         Alert.alert('Error al eliminar el amic');
                         //console.log(response.status);
                       }
         };


     return (
       <Modal
         backdropOpacity={0}
         animationType="none"
         transparent={true}
         isVisible={isVisible}
         onBackdropPress={onClose}
         style={styles.container}
       >
         <View style={styles.popup}>
           <TouchableOpacity onPress={()=> handleUnfriend()}>
             <View>
               <Text>Eliminar amic</Text>
             </View>
            </TouchableOpacity>
         </View>
       </Modal>
     );
   }





const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
    alignItems: 'center',
  },
  popup: {
    position: 'absolute',
    top: '5%',
    right: '1%',
    backgroundColor: 'white',
    width: '28%',
    height: 50,
    paddingLeft: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UnfriendPopup;