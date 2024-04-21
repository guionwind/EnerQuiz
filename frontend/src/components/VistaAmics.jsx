import React, {useState, useCallback, useEffect} from "react";
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
import { MaterialCommunityIcons} from '@expo/vector-icons';
import {useAppContext} from './Appcontext';
import { useIsFocused } from '@react-navigation/native';

function VistaAmics() {

    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [Id, setId] = useState([]);
    const [xats, setXats] = useState([]);
    const [UsernameAmic, setUsernameAmic] = useState([]);
    const [AmicNou, setAmicNou] = useState(true);
    const { mitoken} = useAppContext();


    useEffect(() => {
        const fetchData = async () => {
          await getPerfil(); // Obtener el perfil primero
          if (isFocused && AmicNou) {
            setAmicNou(false);
            console.log(Id);
            if (Id) {
              getConversations(); // Obtener conversaciones solo si Id no es nulo
            }
          }
        };
      
        fetchData();
      }, [isFocused, mitoken]);

     


    const getConversations = async () => {
        try {
            const response = await axios.get('http://nattech.fib.upc.edu:40520/api/conversations', {
                headers: {
                    'Authorization': `Bearer ${mitoken}`,
                }
            });
            if (response.status === 200) {
                const updatedXats = response.data.conversations.map((item) => {
                    let id1 = item.user1_id;
                    let id2 = item.user2_id;
                    let user_id = id2;
          
                    return {
                      ...item,
                      user_id: user_id,
                      username: null, // Agrega un campo para almacenar el nombre del amigo
                    };
                  });
          
                  setXats(updatedXats);
          
                  // Llama a getInfoAmic para cada amigo después de obtener las conversaciones
                  updatedXats.forEach((conversation) => {
                    getInfoAmic(conversation.user_id);
                  });
            } else {
                Alert.alert('No tens cap amic agregat. Afegeix amics per poder parlar i jugar amb ells!');
                console.log(response.status);
            }
        } catch (error) {
          console.error('Error en la llamada GETConversations:', error);
          console.log('Detalles del error:', error.response?.data);
          //Alert.alert('No tens cap amic agregat. Afegeix amics per poder parlar i jugamb ells!');
        }
    };

    const getPerfil = async () => {
        try {
            const response = await axios.get('http://nattech.fib.upc.edu:40520/api/myProfile/id', {
                headers: {
                    'Authorization': `Bearer ${mitoken}`,
                }
            });
            if (response.status === 200) {
                setId(response.data.id);
            } else {
                Alert.alert('No tens cap amic agregat. Afegeix amics per poder parlar i jugar amb ells!');
                console.log(response.status);
            }
        } catch (error) {
          console.error('Error en la llamada GETPerfil:', error);
          //console.log('Detalles del error:', error.response?.data);
          //Alert.alert('No tens cap amic agregat. Afegeix amics per poder parlar i jugamb ells!');
        }
    };

    const getInfoAmic = async (user_id) => {
        try {
            const response = await axios.get(`http://nattech.fib.upc.edu:40520/api/users/${user_id}`, {
                headers: {
                    'Authorization': `Bearer ${mitoken}`,
                }
            });
            if (response.status === 200) {
                setXats((prevXats) =>
                prevXats.map((conversation) =>
                    conversation.user_id === user_id
                    ? { ...conversation, username: response.data.username }
                    : conversation
                )
            );
            } else {
                Alert.alert('No tens cap amic agregat. Afegeix amics per poder parlar i jugar amb ells!');
                console.log(response.status);
            }
        } catch (error) {
          console.error('Error en la llamada GET:', error);
          //console.log('Detalles del error:', error.response?.data);
          //Alert.alert('No tens cap amic agregat. Afegeix amics per poder parlar i jugamb ells!');
        }
    };
        

    //imprimir els usuaris
    const renderItem =({item}) => {
        let xat_id = item.id;
        let id1 = item.user1_id;
        let id2 = item.user2_id;
        
        return (
            <View style={styles.itemWrapper}>
                <TouchableOpacity>
                    <Text onPress={() => navigation.navigate('Chat', {xat_id, id1, id2})} style={styles.usernameText}>{item.username}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.partidaBtn}  onPress={() => navigation.navigate('Partida', {id1, id2})}>
                    <MaterialCommunityIcons name="sword-cross" size={30} color="black" />
                </TouchableOpacity>
            </View>
        )
    }

  return (
    <View style={styles.container}>
        <View style={styles.textContainer}>
            <Text style={styles.text}>Amics</Text>
        </View>
        <View style={styles.flatlist}>
            <FlatList
            data={xats}
            renderItem={renderItem}/>
        </View>
        <View style={styles.container3}>
            <TouchableOpacity onPress={() => {navigation.navigate('Afegir'); setAmicNou(true);}} style={styles.afegirBtn}>
                <Text style={styles.text}>Afegir amics</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}


  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',

    },
    textContainer: {
        position: 'absolute',
        top: 40,
        left: 160,
        width: '100%',  
        height: 30
    },
    itemWrapper: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: 'grey',
        alignItems: 'center',
        maxWidth: '100%'
    },
    flatlist: {
        backgroundColor: 'white',
        width: 375,
        height: '85%',
        marginTop: 'auto'
    },
    container3: {
        alignItems: 'center',
        backgroundColor: 'green',
        width: 300,
        height: 30,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    container4: {
        flexDirection: "row",
        alignItems: 'center',
    },
    usuari: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: 250,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        marginTop:10,
    },
    afegirBtn: {
        alignItems: 'center',
        width: '100%',
        height: 30,
    },
    text: {
        fontWeight: 'bold'
    },
    usernameText: {
        fontWeight: 'bold',
        width: 175
    },
    partidaBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        width: 50,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        marginTop: 10,
        marginLeft: 120,
    }, 
    separator: {
        height: 1,
        backgroundColor: 'gray',
    }
  });
  
export default VistaAmics;