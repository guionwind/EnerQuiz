import React, {useState, useEffect} from 'react';
import Constants from 'expo-constants'
import {useNavigation} from '@react-navigation/native'
import { NavigationContainer } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Alert, StyleSheet, View, Text, TextInput, Image, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard} from 'react-native'
import BottomPopup from './BottomPopup';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18next from '../../services/i18next';
import {useAppContext} from './Appcontext' 



export default function ShowProfile() {
    const { mitoken} = useAppContext();
    const { t, i18n } = useTranslation();
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [input4, setInput4] = useState('');
    const [input5, setInput5] = useState('');
    const [input6, setInput6] = useState(''); // falta que se actualice
    const [input7, setInput7] = useState('');
    const navigation = useNavigation();
    const [isInputFocused, setInputFocused] = useState({});
    const [dadesPerfil, setDadesPerfil] = useState([]);


  const handleInputChange = (fieldName, value) => {
      setProfile({ ...Profile, [fieldName]: value });
    };

    const handleSubmit = async () => {
          try {
            const data = {
              name: input1,
              username: input2,
              bio: input3,
              email: input4,
              password: input5,
              language: input6,
              profile_picture: input7, // falta
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

          navigation.navigate("Profile")
    };



  



  const handleScreenTouch = () => {
      // Cierra el teclado cuando se toca fuera de un TextInput
      Keyboard.dismiss();
    };

    useEffect(() => {
        const obtenirDadesPerfil = async () => {
          try {
            const response = await axios.get('http://nattech.fib.upc.edu:40520/api/myProfile', {
              headers: {
                'Authorization': `Bearer ${mitoken}`,
              }
            });
            if (response.status === 200) {
              setInput1(response.data.name);
              setInput2(response.data.username);
              setInput3(response.data.bio);
              setInput4(response.data.email);
              setInput5(response.data.password);
            } else {
              Alert.alert('Error al carregar el perfil');
              //console.log(response.status);
            }
          } catch (error) {
            console.error('Error en la llamada GET:', error);
            Alert.alert('Error al carregar el perfil');
            //console.log('Detalles del error:', error.response?.data);
          }
        };
    obtenirDadesPerfil();
  },[]);


    const handleLanguageChange = (value) => {
      i18n.changeLanguage(value);
    };

  return (
  <TouchableWithoutFeedback onPress={handleScreenTouch}>
        <View style={styles.container}>
            <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Profile")}>
                      <Icon name="angle-left" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonpop}>
                                          <Image
                                            source={require("../../assets/logoEnerQuiz.png")}
                                            style={styles.image_round}
                                          />
                                        </TouchableOpacity>
                  </View>

              

              {/* <TextInput
                style={[styles.input,isInputFocused.imagen_usuario && styles.focusedInput]}
                value={Profile.imagen_usuario}
                onChangeText={(text) => handleInputChange('imagen_usuario', text)}
                onFocus={() => setInputFocused({ ...isInputFocused, imagen_usuario: true })}
                onBlur={() => setInputFocused({ ...isInputFocused, imagen_usuario: false })}
              /> */}

              <Text style={styles.label}>{t('nombre')}</Text>
              <TextInput
                style={[styles.input,dadesPerfil.name && styles.focusedInput]}
                value={input1}
                onChangeText={setInput1}
                onFocus={() => setInputFocused({ ...isInputFocused, nombre: true })}
                onBlur={() => setInputFocused({ ...isInputFocused, nombre: false })}
              />

              <Text style={styles.label}>{t('nombreUsuario')}</Text>
              <TextInput
                style={[styles.input,dadesPerfil.username && styles.focusedInput]}
                value={input2}
                onChangeText={setInput2}
                onFocus={() => setInputFocused({ ...isInputFocused, username: true })}
                onBlur={() => setInputFocused({ ...isInputFocused, username: false })}
              />

              <Text style={styles.label}>{t('descripcion')}</Text>
              <TextInput
                style={[styles.input,{height: 60, textAlignVertical: 'top'},dadesPerfil.bio && styles.focusedInput]}
                value={input3}
                onChangeText={setInput3}
                onFocus={() => setInputFocused({ ...isInputFocused, descripcion: true })}
                onBlur={() => setInputFocused({ ...isInputFocused, descripcion: false })}
                multiline={true}
              />

              <Text style={styles.label}>{t('email')}</Text>
              <TextInput
                style={[styles.input,dadesPerfil.email && styles.focusedInput]}
                value={input4}
                onChangeText={setInput4}
                onFocus={() => setInputFocused({ ...isInputFocused, email: true })}
                onBlur={() => setInputFocused({ ...isInputFocused, email: false })}
              />

              <Text style={styles.label}>{t('contrasenya')}</Text>
              <TextInput
                style={[styles.input,dadesPerfil.password && styles.focusedInput]}
                value={input5}
                onChangeText={setInput5}
                secureTextEntry={true}
                onFocus={() => setInputFocused({ ...isInputFocused, contraseña: true })}
                onBlur={() => setInputFocused({ ...isInputFocused, contraseña: false })}
              />

              <TouchableOpacity style={styles.button2} onPress={handleSubmit}>
                      <Text> {t('guardarCambios')}</Text>
                    </TouchableOpacity>

            </View>
     </TouchableWithoutFeedback>
  );
  }

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
      fotoPerfil: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
      },
      input: {
        borderBottomWidth: 1, // Línea inferior
        borderColor: 'lightgray', // Color de la línea
        width: '98%', // Ancho del cuadro de texto
        padding: 2, // Espacio interno
        paddingLeft: 5
      },
      focusedInput: {
        borderBottomWidth: 1, // Línea inferior
        borderColor: 'black', // Color de la línea
        width: '98%', // Ancho del cuadro de texto
        padding: 2, // Espacio interno
        paddingLeft: 5
        },
      button: {
        backgroundColor: '#529D09', // Puedes cambiar el color de fondo según tus necesidades
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 20,
        width: 100
      },
      button2: {
              backgroundColor: '#529D09', // Color de fondo personalizado
                  padding: 10,
                  borderRadius: 5,
                  marginLeft: 10,
                  marginTop: 20,
            },
    button3: {
            backgroundColor: '#529D09', // Puedes cambiar el color de fondo según tus necesidades
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            marginTop: 10,
            borderWidth: 3,
            borderColor: 'black',
            borderRadius: 20,
            width: 100
          },
      backButton: {
            position: 'absolute',
            top: 20,
            left: 10,
      },
      buttonpop: {
              padding: 5,
              borderRadius: 5,
              marginTop: 50,
              marginLeft: 200
          },
      text: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold'
      },
      text2: {
              color: 'black',
              textAlign: 'center',
            },
      image_round: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 30,
        borderWidth: 2,
      },

      label: {
        color: 'grey',
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 5

      },
      picker: {
          width: 300,
        }
  });

