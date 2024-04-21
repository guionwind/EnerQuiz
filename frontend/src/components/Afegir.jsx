import React, {useState, useCallback} from "react";
import Constants from 'expo-constants'
import { NavigationContainer } from '@react-navigation/native';
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import Registre from "./Registre";
import PantallaMapa from "./PantallaMapa";
import ShowProfile from "./ShowProfile";
import Profile from "./Profile";
import {Alert, StyleSheet, View, Text, TextInput, Image, TouchableOpacity, FlatList} from 'react-native';
import IconBar from './IconBar';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import {useAppContext} from './Appcontext';

function Afegir() {

    const [input1, setInput1] = useState('');
    const [usuaris, setUsuaris] = useState([]);
    const navigation = useNavigation();
    const { mitoken} = useAppContext();
    //const [usuari, setUsuari] = useState(['usuari1', 'usuari2', 'usuari3', 'usuari4', 'usuari5', 'usuari6','usuari7', 'usuari8', 'usuari9', 'usuari10', 'usuari1', 'usuari2', 'usuari3', 'usuari4']);

    const handleCerca = async () => {
        try {
          const response = await axios.get(`http://nattech.fib.upc.edu:40520/api/users/search?search=${input1}`);
          if (response.status === 200) {
            setUsuaris(response.data.result);
          } else {
            Alert.alert('No existeix cap usuari amb aquest nom');
            console.log(response.status);
          }
        } catch (error) {
          console.error('Error en la llamada POST:', error);
          //console.log('Detalles del error:', error.response?.data);
          //Alert.alert('No existeix cap usuari amb aquest nom');
        }
        setInput1("");
    };

    const handleAfegiAmic = async (user_id) => {
      try {
        const data = {
          id: user_id
        };
        const response = await axios.post(`http://nattech.fib.upc.edu:40520/api/addfriend/${user_id}`, data, {
          headers: {
              'Authorization': `Bearer ${mitoken}`,
          }
        });
        if (response.status === 200) {
          navigation.navigate('Xats');
        } else {
          Alert.alert('Error al afegir amic');
        }
      } catch (error) {
        if(error.response) {
          if (error.response.status == 400) {
            Alert.alert('Amic ja existent');
          } else if (error.response.status == 404) {
            Alert.alert('Usuari no trobat');
          }
        }
        
        console.error('Error en la llamada POST:', error);
        console.log('Detalles del error:', error.response?.data);
        //Alert.alert('Error al afegir amic');
      }
    };


    //imprimir els usuaris
    const renderItem =({item}) => {
        return (
            <View style={styles.itemWrapper}>
                <Text style={styles.usernameText}>{item.username}</Text>
                <TouchableOpacity style={styles.afegirBtn}
                onPress={() => handleAfegiAmic(item.id)}>
                  <Ionicons name="person-add" size={24} color="black" />
                </TouchableOpacity>
            </View>
        )
    }

  return (
    <View style={styles.container}>
      <View style={styles.container3}>
      <TouchableOpacity onPress={() => navigation.navigate('Xats')}>
        <Ionicons name="arrow-back-outline" size={28} color="black" />
      </TouchableOpacity>
      </View>
        <View style={styles.container2}>
            <TextInput 
                style={styles.input}
                placeholder="Nom d'usuari"
                onChangeText={setInput1}
                value = {input1}>
            </TextInput>
            <TouchableOpacity style={styles.cercaBtn}
            onPress={handleCerca}>
                <Text>Cercar</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.flatlist}>
          <FlatList
            data={usuaris}
            //keyExtractor={item => item.username}
            renderItem={renderItem}/>
        </View>
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 70,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    container2: {
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'center'
    },
    container3: {
      position: 'absolute',
      top: 30,
      left: 15,
      width: 90,  
      height: 30
    },
    input: {
        backgroundColor: 'white',
        width: 200,
        height: 30,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginRight: 5,
        padding: 5
    },
    flatlist: {
      backgroundColor: 'white',
      width: 375,
      height: '90%',
      marginTop: 25,
    },
    itemWrapper: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: 'grey',
        alignItems: 'center'
    },
    cercaBtn: {
        backgroundColor: '#529D09',
        width: 70,
        height: 30,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    afegirBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#529D09',
      width: 50,
      height: 40,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 10,
      marginTop: 10,
      marginLeft: 120,
  },
  usernameText: {
    fontWeight: 'bold',
    width: 175
  },
  text: {
        fontWeight: 'bold'
  }
  });
  
export default Afegir;